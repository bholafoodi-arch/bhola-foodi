// src/hooks/UseRole.js
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxiosPublic from "./useAxiosPublic";


const UseRole = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const { data: role, isLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosPublic(`/user/${user?.email}`);
      return data.role;
    },
  });
  

  return [role, isLoading];
};

export default UseRole;
