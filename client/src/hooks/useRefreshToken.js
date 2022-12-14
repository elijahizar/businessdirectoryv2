import React from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setIsAuthenticated } = useAuth();
  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setIsAuthenticated((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
}

export default useRefreshToken;
