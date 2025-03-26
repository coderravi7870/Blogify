const { Router } = require("express");

const Blog = require("../models/blog");
const Comment = require("../models/comments");

const route = Router();

const cloudinary = require("../cloudinaryConfig");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

route.get("/add-new", (req, res) => {
  return res.render("addblog", {
    user: req.user,
    path:"/blog/add-new"
  });
});

route.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("ceratedBy");
  const comments = await Comment.find({blogId:req.params.id}).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
    comments
  });
});

route.post("/comment/:blogId",async (req, res) => {
    const {content} = req.body;
    await Comment.create({
        content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });

    return res.redirect(`/blog/${req.params.blogId}`);
})

route.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  // Upload file to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "blogify",
  });

  // Delete temporary file
  fs.unlinkSync(req.file.path);

  const blog = await Blog.create({
    title,
    body,
    ceratedBy: req.user._id,
    coverImageURL: result?.secure_url,
  });

  return res.redirect(`/blog/${blog._id}`);
});


module.exports = route;
