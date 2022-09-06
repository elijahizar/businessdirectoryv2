import React from "react";
import { useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import "./Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    console.log(searchTerm);
  };

  useEffect(() => {
    const getPostsBySearch = (searchTerm) => {};
  }, []);

  return (
    <>
      <div className="search">
        <input
          type="text"
          name="searchBar"
          value={searchTerm}
          onChange={handleChange}
          id="searchBar"
          placeholder="Search business"
        />
      </div>
    </>
  );
}

export default Search;
