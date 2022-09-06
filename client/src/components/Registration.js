import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3)
    .max(15)
    .required("You must input your username."),
  password: Yup.string()
    .min(8)
    .max(20)
    .required("You must input your password."),
});

const Registration = () => {
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios.post("http://localhost:3001/auth", values).then((response) => {
        console.log(values);
        navigate("/");
      });
    },
  });

  return (
    <section>
      <h2>Create an account</h2>
      <div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <p></p>
          <TextField
            fullWidth
            type="text"
            label="Username"
            name="username"
            id="username"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.username}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <br />

          <TextField
            fullWidth
            autoComplete="off"
            label="Password"
            type="password"
            name="password"
            id="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <br />

          <Button variant="contained" fullWidth type="submit">
            Register
          </Button>
        </Box>
      </div>
    </section>
  );
};

export default Registration;
