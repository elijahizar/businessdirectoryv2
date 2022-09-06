import useAxiosPrivate from "../hooks/useAuthPrivate";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid"; // Grid version 1
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import FilterByCategory from "./FilterByCategory";
import Search from "./SearchBar";

function Posts() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  const getFilter = async (props) => {
    setFilter(props);
  };

  const getPosts = async (filter) => {
    console.log(filter);
    if (filter != "all") {
      try {
        console.log("Trying request");
        const response = await axiosPrivate.get("/posts/category/" + filter);
        console.log(response);
        if (response.data) {
          setListOfPosts(response.data);
          console.log(response.data);
        } else {
          console.log("No posts." + filter);
        }
      } catch (err) {
        console.error("Error requesting posts: " + err);
      }
    } else {
      try {
        console.log("No filter");
        const response = await axiosPrivate.get("/posts");
        setListOfPosts(response.data);
      } catch (err) {
        console.error("Error requesting posts: " + err);

        // navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };
  useEffect(() => {
    getPosts(filter);
  }, [filter]);
  return (
    <div>
      <h1>Businesses</h1>
      <br />
      <FilterByCategory onChange={getFilter} />
      <br />
      <Grid container fullWidth spacing={{ xs: 5 }} justifyContent="center">
        {listOfPosts.map((value, key) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Card
                className="postsCards"
                onClick={() => navigate(`/post/${value.id}`)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    className="postThumbnail"
                    image={value.photo}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "break-spaces" }}
                    >
                      {value.postText.substring(0, 300)}...
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default Posts;
