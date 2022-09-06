import React, { useState, useEffect } from "react";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../hooks/useAuthPrivate";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "../api/axios";

const initialValues = {
  title: "",
  postText: "",
  email: "",
  phone: "",
  ville: "",
  postalCode: "",
  photo: "",
  idcategory: "",
  address: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Max. 50 characters")
    .required("You must input a title!"),
  postText: Yup.string().required("Description is required!"),
  email: Yup.string().email("Invalid email").required("An email is required."),
});

function EditPost() {
  let { id } = useParams();

  const [postObject, setPostObject] = useState({});
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  let navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated } = useAuth();
  const currentUsername = isAuthenticated.username;
  const [categories, setCategories] = useState([]);
  const [villes, setVilles] = useState([]);

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

  // Requête valeurs actuelles
  useEffect(() => {
    axiosPrivate.get("/posts/" + id).then((response) => {
      const fields = [
        "title",
        "postText",
        "phone",
        "email",
        "address",
        "postalCode",
        "ville",
        "photo",
        "idcategory",
      ];

      fields.forEach((field) =>
        formik.setFieldValue(field, response.data[field], false)
      );
    });
  }, []);

  // Edit post Form
  const formik = useFormik({
    initialValues: initialValues,
    enctype: "multipart/form-data",
    validationSchema: validationSchema,
    method: "post",
    onSubmit: (values) => {
      console.log(values);
      axiosPrivate
        .post(
          `http://localhost:3001/posts/${id}/edit`,
          { ...values, username: currentUsername, id: id },
          { withCredentials: true, "Content-Type": "multipart/form-data" }
        )
        .then((response) => {
          console.log(response);
          navigate(`/post/${id}`);
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
              width: { xs: 300, sm: 580, md: 600, lg: 1000, xl: 1500 },
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
          />
          <br />
          <FormControl fullWidth>
            <InputLabel id="idcategory">Category</InputLabel>
            <Select
              labelId="idcategory"
              id="idcategory"
              value={formik.values.idcategory}
              onChange={formik.handleChange}
              label="category"
              name="idcategory"
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
            name="postText"
            label="Description"
            multiline
            rows={8}
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.postText}
            className="formTextArea"
          />
          <br />
          <TextField
            name="phone"
            label="Phone number"
            onChange={formik.handleChange}
            value={formik.values.phone}
            className="formTextArea"
          />
          <br />
          <TextField
            name="email"
            label="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="formTextArea"
          />
          <br />
          <TextField
            name="address"
            label="Address"
            onChange={formik.handleChange}
            value={formik.values.address}
            className="formTextArea"
          />
          <br />
          <TextField
            name="postalCode"
            label="Postal Code"
            onChange={formik.handleChange}
            value={formik.values.postalCode}
            className="formTextArea"
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
            Upload photo {filename}
            <input
              type="file"
              name="photo"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.currentTarget.files[0];
                formik.setFieldValue("photo", file);
                setFile(file);
                setFilename(file?.name);
                console.log("File to upload: " + file);
              }}
            ></input>
          </Button>
          <br />
          <Button variant="contained" fullWidth type="submit">
            Update
          </Button>
        </Box>
      </div>
    </section>
  );
}

export default EditPost;
