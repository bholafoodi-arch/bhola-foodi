import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://up-server-main.vercel.app",
  // baseURL: "http://localhost:5000",
  //https://up-server-main.vercel.app
});
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
