const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
require("dotenv").config();


const mongodb = require("./db/db");

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

// middleware
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));


// connect database
mongodb();

// Route
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const checkForAuthenticationCookie = require('./middleware/authentication');
const Blog = require('./models/blog');

app.use(checkForAuthenticationCookie("token"));
app.use("/user", userRoutes);
app.use("/blog",blogRoutes);

app.get('/', async (req, res) => {
    const blogs = await Blog.find();
    res.render('home',{
        user: req.user,
        blogs: blogs,
        path: "/"
    });
});

app.get("*", async (req, res) => {
    res.status(404).render("404",{
        user: req.user,
        path: req.url
    });
})

const PORT =process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`server listening on ${PORT}`);
})