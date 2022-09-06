import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAuthPrivate";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const FilterByCategory = (props) => {
  const [categories, setCategories] = useState([]);
  const axiosPrivate = useAxiosPrivate();

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

  const [category, setCategory] = useState("all");

  const handleChange = (event) => {
    setCategory(event.target.value);
    props.onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl>
        <InputLabel id="filterByCategory">Filter by Category</InputLabel>
        <Select
          labelId="filterByCategory"
          id="filterByCategory"
          value={category}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value="all">All categories</MenuItem>
          {categories.map((value, key) => {
            return (
              <MenuItem key={key} value={value.idcategory}>
                {value.category_name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
export default FilterByCategory;
