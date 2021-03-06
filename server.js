var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require('express-handlebars');



var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 4000;


var app = express();

// Configure middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/newsApp", {
  useMongoClient: true
});

// Routes

  app.get('/', function(req, res){
    res.render('index');
  });

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  axios.get("http://www.echojs.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article h2").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      db.Article
        .create(result)
        .then(function(dbArticle) {
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          res.send('No articles were added.')
          console.log(err);
        });
    });
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      if(!dbArticle){
        res.send('No articles are saved. Click the "Grab New Headlines" button.')
        return;
      }
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/delete/:id", function(req, res) {
  console.log('the id is ' + req.params.id);

  db.Article
  .findByIdAndRemove({ _id: req.params.id })
    .then(function() {
          console.log('deletion complete');
          res.send(req.params.id)
    })
    .catch(function(err) {
      res.json(err);
    });
  });


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
