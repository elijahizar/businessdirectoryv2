const express = require("express");
const { Comments } = require("../models");

const getCommentsByPost = async (req, res) => {
  const postId = req?.params?.id;
  console.log("Post ID: ", postId);
  if (postId) {
    const commentsById = await Comments.findAll({ where: { PostId: postId } });
    res.json(commentsById);
  }
};

const createComment = async (req, res) => {
  const commentBody = req.body.commentBody;
  const postId = req.params.id;
  console.log("Comments posted: ", commentBody, postId);
  await Comments.create({
    commentBody: commentBody,
    postId: postId,
  });
  res.json(commentBody);
};

module.exports = {
  getCommentsByPost,
  createComment,
};
