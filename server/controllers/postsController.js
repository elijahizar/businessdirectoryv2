const express = require("express");
const { Posts } = require("../models");

const getAllPosts = async (req, res) => {
  const listOfPosts = await Posts.findAll();
  res.json(listOfPosts);
};

const getOnePost = async (req, res) => {
  const id = req.params.id;
  const postById = await Posts.findByPk(id);
  res.json(postById);
};

const getPostByTitle = async (req, res) => {
  const searchTitle = req.params.title;
  const postById = await Posts.findAll({ where: { title: searchTitle } });
  res.json(postById);
};

const getPostsByCategory = async (req, res) => {
  const idcategory = req.params.idcategory;
  console.log("Category filtered: ", idcategory);
  const postsByCategory = await Posts.findAll({
    where: { idcategory: idcategory },
  });
  res.json(postsByCategory);
};

const createPost = async (req, res) => {
  console.log(req.files);
  const timestamp = Date.now();
  const post = req.body;
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.photo;
  const filePath = `../client/public/uploads/${timestamp}${file.name}`;

  file.mv(filePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });

  await Posts.create({
    title: req.body.title,
    postText: req.body.postText,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    ville: req.body.ville,
    photo: `/uploads/${timestamp}${file.name}`,
    idcategory: req.body.idcategory,
  });
  res.json({
    post: post,
    fileName: file.name,
    filePath: `/uploads/${timestamp}${file.name}`,
  });
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const postDeleted = await Posts.destroy({ where: { id: postId } });
  res.json(`Post #${postDeleted} deleted successfully.`);
};

const editPost = async (req, res) => {
  let frontendPhotoPath;
  if (req?.files?.photo) {
    const timestamp = Date.now();
    const file = req.files.photo;
    const filePath = `../client/public/uploads/${timestamp}${file.name}`;
    frontendPhotoPath = `/uploads/${timestamp}${file.name}`;
    file.mv(filePath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });
  } else {
    frontendPhotoPath = req.body.photo;
  }

  const editedPost = await Posts.update(
    {
      titre: req.body.titre,
      postText: req.body.postText,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      ville: req.body.ville,
      photo: frontendPhotoPath,
      idcategory: req.body.idcategory,
    },
    { where: { id: req.params.id } }
  );
  res.json(`Post #${editedPost} edited successfully.`);
  console.log(`Post ${editedPost} edited. `);
};

module.exports = {
  getAllPosts,
  getOnePost,
  createPost,
  deletePost,
  editPost,
  getPostsByCategory,
};
