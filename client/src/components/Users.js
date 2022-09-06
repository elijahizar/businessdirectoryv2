import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAuthPrivate";

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    /*   let isMounted = true;
    const controller = new AbortController();
 */
    getUsers();
    /*  return () => {
      isMounted = false;
      controller.abort();
    }; */
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosPrivate.get("/auth");

      setUsers(response.data);
    } catch (err) {
      console.log("Error: ", err);
      //  navigate("/login", { state: { from: useLocation }, replace: true });
    }
  };

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}

      <br />
    </article>
  );
};

export default Users;
