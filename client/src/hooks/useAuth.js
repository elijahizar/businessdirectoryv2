import { useContext } from "react";
import AuthContext from "../contexts/AuthProvider";

const useAuth = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return useContext(AuthContext);
};

export default useAuth;
