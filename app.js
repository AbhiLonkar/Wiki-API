const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash")

mongoose.connect("mongodb://127.0.0.1:27017/WikiDB");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("article", articleSchema);

// I have just created menu for client. In this menu there are many different types of requests and the server responds to these 
// requests as I have asked them to.

// eg when client asks for data ie get then simply find all the documents and send them to the client
app.route("/articles")
  .get(function (req, res) {
    Article.find()
      .then((article) => res.send(article))
      .catch((err) => console.log(err));
  })

  .post(function (req, res) {
    const postmanTitle = req.body.title;
    const postmanContent = req.body.content;

    const article = new Article({
      title: postmanTitle,
      content: postmanContent,
    });

    article.save().then(() => 
        res.send("Successfully saved")
    ).catch((err) => 
        res.send(err)
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: "CMD" })
      .then(() => res.send("Successfully Deleted"))
      .catch((err) => res.send(err));
  });

app.route("/articles/:articleTitle")
    
//   simply read the document
  .get(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle}).then((article)=>
        res.send(article)
    ).catch((err)=>
        res.send(err)
    )
  })

  // Completely replace the document
  .put(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.replaceOne({title: articleTitle},{title: req.body.title, content: req.body.content},{overwrite:true})
                            // Query                        New Values                              
    .then(()=>
        res.send("Updated")
    ).catch((err)=>
        res.log(err)
    )
    })

    // Update a specific property of a document
    .patch(function(req,res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body}                                    // Here req.body is an object
            ).then(()=>
                res.log("Successfully updated")
            ).catch((err)=>
                res.log(err)
            )
    })

    .delete(function(req,res){
        Article.deleteOne({title: req.params.articleTitle}).then(()=>
            res.send("Successfully deleted")
        ).catch((err)=>
            res.send(err)
        )
    })

app.listen(3000, function () {
  console.log("server started at 3000");
});
