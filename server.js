// Required Initializations
const express = require ("express");
const exphbs = require ("express-handlebars");
const mongoose = require ("mongoose");
const logger = require ("morgan");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require ("axios");
const cheerio = require ("cheerio");

// Require models
const db = require ("./models");

const PORT = 3000;

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

const index = require ("./routes/index");
const api = require ("./routes/api");

// Use morgan logger for logging requests
app.use(logger("dev"));
//Parse request body as JSON
app.use(express.urlencoded({extended: true}));
//Make public a static folder
app.use(express.static("public"));

//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScraperHomework", {useNewUrlParser: true});

// Routes

// GET route for scraping the website in question
app.get("/scrape", function (req, res){
    axios.get("http://www.foxnews.com/").then(function(response){
        const $ = cheerio.load(response.data);
//Grab Main Headline
        $("article story-1").each(function(i, element){
            const result {};
            result.title = $(this)
            .children("kicker-text")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            // Create a new Article using the 'result' object built from scraping
            db.ArticleHeadline.create(result)
            .then(function(dbArticleHeadline){
                //View the added result in console
                console.log(dbArticleHeadline);
            })
            .catch(function(err){
                //If error, log
                console.log(err);
            });
        });
        $("collection collection-spotlight").each(function(i, element){
            const result {};
            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            // Create a new article using the result
            db.Article.create(result)
            .then(function(dbArticle){
                //View the added result in console
                console.log(dbArticle);
            })
            .catch (function (err){
                //If error, log
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});