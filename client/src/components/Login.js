import React, { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const LOGIN_URL = "/auth/login";

function Login() {
  const { setIsAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const userRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, []);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const { username, password } = user;

  const [searchParams, setSearchParams] = useSearchParams();
  const msg = searchParams.get("m");

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { username: username, password: password };

    axios
      .post(LOGIN_URL, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          const accessToken = response?.data?.accessToken;
          const roles = response?.data?.roles;
          setIsAuthenticated({ username, password, roles, accessToken });
          console.log(username, " authenticated. ", response.data);

          navigate("/posts", { replace: true });
        }
      })
      .catch((err) => {
        if (!err.response) {
          setErrMsg("No server response");
        } else if (err.response?.status === 400) {
          setErrMsg("Missing username or password.");
        } else if (err.response?.status === 401) {
          setErrMsg("Username or password not found.");
        } else {
          setErrMsg("Login failed");
        }
        console.log(err);
        errRef.current.focus();
      });
  };

  return (
    <section>
      <h2>Login</h2>
      <div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <p>{msg}</p>
          <TextField
            fullWidth
            type="text"
            label="Username"
            name="username"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={handleChange}
            value={user.username}
            required
          />
          <br />
          <TextField
            fullWidth
            autoComplete="off"
            label="Password"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={user.password}
            required
          />
          <br />
          <Button variant="contained" type="submit" fullWidth>
            Login
          </Button>
        </Box>
      </div>
    </section>
  );
}

export default Login;
