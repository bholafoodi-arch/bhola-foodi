import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, Collection, Db, ObjectId } from "mongodb";
import { createServer as createViteServer } from "vite";
import webpush from "web-push";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Large payload limit for base64 images

// MongoDB Atlas URI Setup (using user's exact provided credentials with secure env overrides)
const dbUser = process.env.DB_USER || "bhola";
const dbPass = process.env.DB_PASS || "marufmeze";

const uri = `mongodb+srv://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPass)}@cluster0.ciworka.mongodb.net/?appName=Cluster0`;

console.log(`Initializing MongoDB connection with user: "${dbUser}" to cluster0.ciworka.mongodb.net...`);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db;
let foodCollection: Collection<any>;
let restaurantCollection: Collection<any>;
let reviewCollection: Collection<any>;
let orderCollection: Collection<any>;
let userCollection: Collection<any>;
let cartCollection: Collection<any>;
let pushSubscriptionCollection: Collection<any>;
let settingsCollection: Collection<any>;

let vapidKeys: { publicKey: string; privateKey: string } | null = null;

async function initVapidKeys() {
  try {
    if (!settingsCollection) return;
    const keysDoc = await settingsCollection.findOne({ type: "vapid_keys" });
    if (keysDoc) {
      vapidKeys = {
        publicKey: keysDoc.publicKey,
        privateKey: keysDoc.privateKey
      };
      console.log("VAPID Keys loaded successfully from database settings.");
    } else {
      const generated = webpush.generateVAPIDKeys();
      vapidKeys = {
        publicKey: generated.publicKey,
        privateKey: generated.privateKey
      };
      await settingsCollection.insertOne({
        type: "vapid_keys",
        publicKey: generated.publicKey,
        privateKey: generated.privateKey,
        createdAt: new Date()
      });
      console.log("New VAPID Keys generated and saved to database settings.");
    }

    webpush.setVapidDetails(
      "mailto:bholafoodi@gmail.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
  } catch (err) {
    console.error("Error initializing VAPID keys:", err);
  }
}

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas (BholaFoodi)!");
    
    db = client.db("BholaFoodi");
    foodCollection = db.collection("foods");
    restaurantCollection = db.collection("Kitchen"); // Kitchen Collection for restaurants
    reviewCollection = db.collection("reviews");
    orderCollection = db.collection("orders");
    userCollection = db.collection("users");
    cartCollection = db.collection("carts");
    pushSubscriptionCollection = db.collection("push_subscriptions");
    settingsCollection = db.collection("settings");

    console.log("MongoDB connection finished successfully.");
    
    // Initialize VAPID Keys for Web Push Notifications
    await initVapidKeys();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

connectDB();

// --- Query and Mapping Helpers for Robustness ---
function getQueryById(id: string) {
  const query: any = { $or: [{ id: id }] };
  try {
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    } else {
      query.$or.push({ _id: id });
    }
  } catch (e) {
    // Ignore invalid ObjectId error
  }
  return query;
}

const mapProductFromDB = (p: any) => {
  const id = p.id || p._id?.toString() || "";
  const image = p.image || (Array.isArray(p.images) && p.images[0]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
  const isFeatured = p.isFeatured !== undefined ? p.isFeatured : (p.featured !== undefined ? p.featured : false);
  const isPopular = p.isPopular !== undefined ? p.isPopular : (p.rating >= 4.7);
  const isOutOfStock = p.isOutOfStock !== undefined ? p.isOutOfStock : (p.available === false || p.stock === 0);
  const prepTime = p.prepTime || "15-25 min";
  const restaurantName = p.restaurantName || "Bhola Kitchen";
  const reviewsCount = p.reviewsCount !== undefined ? p.reviewsCount : Math.floor((p.rating || 4.5) * 8 + (p._id?.toString() ? p._id.toString().charCodeAt(0) % 15 : 12));
  const tags = p.tags || (isFeatured ? ["Best Seller"] : []);

  return {
    ...p,
    id,
    image,
    isFeatured,
    isPopular,
    isOutOfStock,
    prepTime,
    restaurantName,
    reviewsCount,
    tags
  };
};

// DB Connection Status Check
app.get("/api/db-status", (req, res) => {
  res.json({
    connected: !!userCollection,
    error: !!userCollection ? null : "MongoDB connection failed. Please check your network or cluster credentials."
  });
});

// --- Web Push Notifications Helpers & Routes ---

async function sendPushToAdmins(order: any) {
  try {
    if (!pushSubscriptionCollection || !userCollection) return;

    // 1. Find all admin and sub-admin users
    const admins = await userCollection.find({ 
      role: { $in: ["admin", "sub-admin"] } 
    }).toArray();
    
    if (admins.length === 0) return;
    const adminEmails = admins.map(admin => admin.email).filter(Boolean);

    // 2. Fetch subscriptions associated with these emails
    const subscriptions = await pushSubscriptionCollection.find({
      email: { $in: adminEmails }
    }).toArray();

    if (subscriptions.length === 0) return;

    // Create push payload
    const payload = JSON.stringify({
      title: "New Order Received! 🍔",
      body: `Order #${order.id || order._id} placed by ${order.name || "Customer"}. Total: ৳${order.totalPrice || order.total || 0}`,
      icon: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=192",
      badge: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=96",
      data: {
        url: "/dashboard?tab=orders"
      }
    });

    console.log(`Sending Web Push notifications to ${subscriptions.length} devices...`);

    // Send to each subscription
    const promises = subscriptions.map(async (subDoc) => {
      try {
        await webpush.sendNotification(subDoc.subscription, payload);
      } catch (err: any) {
        // If the subscription is expired or invalid (e.g. 410 Gone / 404), remove it from DB
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Removing expired subscription: ${subDoc.subscription.endpoint}`);
          await pushSubscriptionCollection.deleteOne({ _id: subDoc._id });
        } else {
          console.error(`Failed to send push to subscription ${subDoc.subscription.endpoint}:`, err);
        }
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error("Error in sendPushToAdmins:", error);
  }
}

// Get public key
app.get("/api/push-public-key", (req, res) => {
  if (vapidKeys && vapidKeys.publicKey) {
    res.json({ publicKey: vapidKeys.publicKey });
  } else {
    res.status(500).json({ error: "VAPID Keys not initialized yet. Please try again." });
  }
});

// Save subscription
app.post("/api/push-subscribe", async (req, res) => {
  try {
    const { subscription, email } = req.body;
    if (!subscription) {
      return res.status(400).json({ error: "Subscription object is required" });
    }
    
    if (pushSubscriptionCollection) {
      // Upsert subscription based on subscription.endpoint to avoid duplicate notifications for the same device
      await pushSubscriptionCollection.updateOne(
        { "subscription.endpoint": subscription.endpoint },
        { 
          $set: { 
            subscription, 
            email, 
            updatedAt: new Date() 
          } 
        },
        { upsert: true }
      );
      res.json({ success: true, message: "Subscription saved successfully" });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// --- API Endpoints ---

// Products (Foods)
app.get("/api/products", async (req, res) => {
  try {
    if (foodCollection) {
      const productsFromDB = await foodCollection.find({}).toArray();
      const products = productsFromDB.map(mapProductFromDB);
      res.json(products);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.json([]);
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = req.body;
    if (!product.id) {
      product.id = `food-${Date.now()}`;
    }
    if (foodCollection) {
      const result = await foodCollection.insertOne(product);
      res.status(201).json(mapProductFromDB({ ...product, _id: result.insertedId }));
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (foodCollection) {
      const query = getQueryById(id);
      const result = await foodCollection.deleteOne(query);
      res.json({ success: true, deletedCount: result.deletedCount });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Prevent modifying database internal _id field
    delete updateData._id;
    if (foodCollection) {
      const query = getQueryById(id);
      const result = await foodCollection.updateOne(query, { $set: updateData });
      res.json({ success: true, modifiedCount: result.modifiedCount });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Restaurants (Kitchen)
app.get("/api/restaurants", async (req, res) => {
  try {
    if (restaurantCollection) {
      const restaurants = await restaurantCollection.find({}).toArray();
      res.json(restaurants);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    res.json([]);
  }
});

app.post("/api/restaurants", async (req, res) => {
  try {
    const restaurant = req.body;
    if (!restaurant.id) {
      restaurant.id = `r-${Date.now()}`;
    }
    if (restaurantCollection) {
      const result = await restaurantCollection.insertOne(restaurant);
      res.status(201).json({ ...restaurant, _id: result.insertedId });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    res.status(500).json({ error: "Failed to create restaurant" });
  }
});

// Reviews
app.get("/api/reviews", async (req, res) => {
  try {
    if (reviewCollection) {
      const reviews = await reviewCollection.find({}).toArray();
      res.json(reviews);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.json([]);
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const review = req.body;
    if (!review.id) {
      review.id = `rev-${Date.now()}`;
    }
    if (reviewCollection) {
      const result = await reviewCollection.insertOne(review);
      res.status(201).json({ ...review, _id: result.insertedId });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// Orders
app.get("/api/orders", async (req, res) => {
  try {
    if (orderCollection) {
      const orders = await orderCollection.find({}).toArray();
      res.json(orders);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.json([]);
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;
    if (orderCollection) {
      const result = await orderCollection.insertOne(order);
      
      // Trigger background push notification to all admins/sub-admins
      sendPushToAdmins(order).catch(err => console.error("Error sending push notifications:", err));

      res.status(201).json({ ...order, _id: result.insertedId });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to place order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingStep, deliveryRider } = req.body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingStep !== undefined) updateData.trackingStep = trackingStep;
    if (deliveryRider) updateData.deliveryRider = deliveryRider;

    if (orderCollection) {
      const result = await orderCollection.updateOne({ id }, { $set: updateData });
      res.json({ success: true, modifiedCount: result.modifiedCount });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Carts
app.get("/api/carts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (cartCollection) {
      const cartDoc = await cartCollection.findOne({ userId });
      if (cartDoc) {
        res.json(cartDoc);
      } else {
        res.json({ userId, items: [] });
      }
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

app.post("/api/carts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { items } = req.body;
    if (cartCollection) {
      await cartCollection.updateOne(
        { userId },
        { $set: { userId, items, updatedAt: new Date() } },
        { upsert: true }
      );
      res.json({ success: true });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to update cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Users
app.get("/api/users", async (req, res) => {
  try {
    if (userCollection) {
      const users = await userCollection.find({}).toArray();
      res.json(users);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.json([]);
  }
});

app.post("/api/users/signup", async (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData.id) {
      userData.id = `user-${Date.now()}`;
    }

    if (userCollection) {
      // Check if user already exists
      const existingUser = await userCollection.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }]
      });

      if (existingUser) {
        return res.status(400).json({ error: "User with this email or phone already exists." });
      }

      const result = await userCollection.insertOne(userData);
      res.status(201).json({ success: true, user: { ...userData, _id: result.insertedId } });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to sign up user:", error);
    res.status(500).json({ error: "Failed to sign up user" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    
    if (userCollection) {
      const user = await userCollection.findOne({
        $and: [
          { $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
          { password }
        ]
      });

      if (!user) {
        return res.status(401).json({ error: "Incorrect email, phone or password." });
      }

      res.json({ success: true, user });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to log in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

app.put("/api/users/profile", async (req, res) => {
  try {
    const { id, name, email, phone, address, area, role } = req.body;
    
    const updateData: any = { name, email, phone };
    if (address !== undefined) updateData.address = address;
    if (area !== undefined) updateData.area = area;
    if (role !== undefined) updateData.role = role;

    if (userCollection) {
      const result = await userCollection.updateOne({ id }, { $set: updateData });
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await userCollection.findOne({ id });
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Force Seed Database Endpoint (Disabled as mock data has been removed)
app.post("/api/seed", async (req, res) => {
  res.json({
    success: false,
    message: "Data seeding is disabled. The application is now fully connected to the live MongoDB Atlas database, using authentic, real-time data only."
  });
});

// --- Server & Vite Setup ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
