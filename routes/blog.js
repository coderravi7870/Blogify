const { Router } = require("express");
const route = Router();


// cloudinary set-up
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");

// Set up Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogify", 
  },
});

const upload = multer({ storage: storage });

const Blog = require("../models/blog");
const Comment = require("../models/comments");





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
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: req.file.path,
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).send("Internal Server Error");
  }
});


module.exports = route;
