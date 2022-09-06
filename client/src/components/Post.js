import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAuthPrivate";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

function Post() {
  let { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      axiosPrivate.get("/posts/" + id).then((response) => {
        setPostObject(response.data);
      });

      axiosPrivate.get("/comments/" + id).then((response) => {
        setComments(response.data);
      });
    };
    fetchData();
  }, []);

  const handleDelete = () => {
    axiosPrivate
      .post(
        `http://localhost:3001/posts/${postObject.id}/delete`,
        {
          id: postObject.id,
        },
        { withCredentials: true }
      )
      .then((response) => {
        navigate("/posts?m=Post deleted.");
      });
  };

  const handleChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = () => {
    axiosPrivate
      .post("http://localhost:3001/comments/" + id, {
        commentBody: newComment,
        PostId: id,
      })
      .then((response) => {
        const commentToAdd = { commentBody: newComment };
        console.log(response);
        setComments([...comments, commentToAdd]);
        setNewComment("");
      });
  };

  return (
    <div className="postPage">
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="400"
            image={postObject.photo}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {postObject.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "break-spaces" }}
            >
              {postObject.postText}
            </Typography>
          </CardContent>
        </CardActionArea>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 450 }} aria-label="simple table">
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Phone
                </TableCell>
                <TableCell align="left">{postObject.phone}</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Email
                </TableCell>
                <TableCell align="left">{postObject.email}</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Address
                </TableCell>
                <TableCell align="left">{postObject.address}</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              ></TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Ville
                </TableCell>
                <TableCell align="left">{postObject.ville}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <p>Posted by: {postObject.username}</p>
      <Button onClick={handleDelete}>Delete</Button>
      <Button onClick={() => navigate(`/post/edit/${postObject.id}`)}>
        Edit
      </Button>
      <div className="commentSection">
        <div className="addCommentContainer">
          <textarea
            cols="100"
            placeholder="Write your comment..."
            value={newComment}
            onChange={handleChange}
          />
          <button onClick={addComment} type="submit">
            Submit Comment
          </button>
        </div>
        <div className="listOfComments">
          <h2>Comments</h2>
          {comments.map((value, key) => {
            return (
              <div className="comment" key={key}>
                {value.commentBody}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
