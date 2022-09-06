import React, { useState, useEffect } from "react";
import { useFormik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../hooks/useAuthPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const initialValues = {
  title: "",
  postText: "",
  photo: "",
  email: "",
  phone: "",
  ville: "",
  idcategory: "",
  address: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Max. 50 characters")
    .required("Please input your business' name."),
  postText: Yup.string("Please enter a description.").required(
    "Description is required!"
  ),
  email: Yup.string().email("Invalid email.").required("An email is required."),
  phone: Yup.number()
    .typeError("Number not valid.")
    .min(10, "Phone number should be of minimum 10 characters length.")
    .required("A phone number is required."),
  ville: Yup.string().required("Please select a ville."),
  idcategory: Yup.string().required("Please select a category."),
  address: Yup.string().required("Please input an address."),
  photo: Yup.mixed().required("Please upload a photo."),
});

function CreatePost() {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");

  let navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();
  const currentUsername = isAuthenticated.username;

  const [villes, setVilles] = useState([]);
  const [categories, setCategories] = useState([]);

  const getVilles = async () => {
    try {
      const villes = await axiosPrivate.get("/villes");
      setVilles(villes.data);
    } catch (err) {
      console.err("Error requesting villes: " + err);
    }
  };

  useEffect(() => {
    getVilles();
  }, []);

  const getCategories = async () => {
    try {
      const categories = await axiosPrivate.get("/categories");
      setCategories(categories.data);
    } catch (err) {
      console.err("Error requesting categories: " + err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    enctype: "multipart/form-data",
    validationSchema: validationSchema,
    method: "post",
    onSubmit: (values) => {
      axiosPrivate
        .post(
          "http://localhost:3001/posts",
          { ...values, username: currentUsername },
          { withCredentials: true, "Content-Type": "multipart/form-data" }
        )
        .then((response) => {
          navigate("/");
        });
    },
  });

  return (
    <section>
      <h2>Publish your business</h2>
      <div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": {
              m: 1,
              width: { xs: 300, sm: 580, md: 600, lg: 800, xl: 1000 },
            },
          }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <p></p>
          <TextField
            fullWidth
            type="text"
            label="Business name"
            name="title"
            id="title"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <br />
          <FormControl fullWidth>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              id="idcategory"
              value={formik.values.idcategory}
              onChange={formik.handleChange}
              label="category"
              name="idcategory"
              error={
                formik.touched.idcategory && Boolean(formik.errors.idcategory)
              }
              helpertext={formik.touched.idcategory && formik.errors.idcategory}
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((value, key) => {
                return (
                  <MenuItem key={key} value={value.idcategory}>
                    {value.category_name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <TextField
            fullWidth
            name="postText"
            id="postText"
            label="Description"
            multiline
            rows={8}
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.postText}
            className="formTextArea"
            error={formik.touched.postText && Boolean(formik.errors.postText)}
            helperText={formik.touched.postText && formik.errors.postText}
          />
          <br />
          <TextField
            name="phone"
            id="phone"
            label="Phone number"
            onChange={formik.handleChange}
            value={formik.values.phone}
            className="formTextArea"
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <br />
          <TextField
            fullWidth
            name="email"
            label="Email"
            id="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="formTextArea"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <br />
          <TextField
            name="address"
            label="Address"
            onChange={formik.handleChange}
            value={formik.values.address}
            className="formTextArea"
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
          <br />

          <FormControl fullWidth>
            <InputLabel id="ville">Ville</InputLabel>

            <Select
              labelId="ville"
              id="ville"
              value={formik.values.ville}
              onChange={formik.handleChange}
              label="ville"
              name="ville"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {villes.map((value, key) => {
                return (
                  <MenuItem key={key} value={value.villePostalCode}>
                    {value.villePostalCode} - {value.villeName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <Button variant="outlined" component="label">
            Photo: {filename}
            <input
              type="file"
              name="photo"
              id="photo"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.currentTarget.files[0];
                formik.setFieldValue("photo", file);
                setFile(file);
                setFilename(file?.name);
                console.log(file);
              }}
              error={formik.touched.photo && Boolean(formik.errors.photo)}
              helperText={formik.touched.photo && formik.errors.photo}
            ></input>
          </Button>
          <br />
          <Button variant="contained" fullWidth type="submit">
            Publish
          </Button>
        </Box>
      </div>
    </section>
  );
}

export default CreatePost;
