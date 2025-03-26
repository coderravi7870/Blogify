const { Schema, model, models } = require("mongoose");

const blogSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  coverImageURL: { type: String, required: false },
  ceratedBy: { type: Schema.Types.ObjectId, ref: "user" },
},{timestamps:true});


const Blog = models.blog || model("blog", blogSchema);

module.exports = Blog;
