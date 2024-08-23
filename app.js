//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to our Blog Website!\n\n" +
"Here, you can explore a variety of articles and posts on topics that interest you. " +
"Whether you're looking for insightful articles, tips, or just some light reading, you'll find it here.\n\n" +
"Feel free to browse our latest posts or contribute your own thoughts by composing a new post. Enjoy your visit!";

const aboutContent = "Welcome to our blog! Our mission is to provide a platform where individuals can share their thoughts, experiences, and insights on a variety of topics.\n\n" +
"We believe in the power of words and the value of sharing knowledge. Our blog covers a wide range of subjects, from technology and lifestyle to personal development and more.\n\n" +
"We are a passionate team dedicated to bringing you engaging and thought-provoking content. Thank you for visiting, and we hope you find our posts inspiring and useful.";

const contactContent = "We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.\n\n" +
"Email: contact@ourblogwebsite.com\n\n" +
"You can also follow us on social media for updates and news:\n" +
"- Twitter: @ourblog\n" +
"- Facebook: facebook.com/ourblog\n\n" +
"Thank you for your interest in our blog!";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogdb",{useNewUrlParser: true},{useUnifiedTopology: true});

//Creating a Schema
const postSchema = {
  title: String,
  content: String
};
//mongoose model
const Post = mongoose.model("Post", postSchema);

//the home route
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

// fetching "/compose" page
app.get("/compose", function(req, res){
  res.render("compose");
});

//posting title and content in /compose page
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
// composed blog gets saved and the user is redirected to "/" route
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});
//clicking on readmore on the home screen bring up the post with the id on the url
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started in port 3000 successfully");
});
