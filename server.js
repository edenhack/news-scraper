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

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

//const index = require ("./routes/index");
//const api = require ("./routes/api");

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
    axios.get("https://www.who.int/").then(function(response){
        const $ = cheerio.load(response.data);
        console.log("test");
//Grab Main Headline
        $("section .PageContent").each(function(i, element){
            const result = {};
            result.title = $(this)
            .children("a")
            .attr("aria-label");
            result.link = $(this)
            .children("a")
            .attr("href");

            // Create a new Article using the 'result' object built from scraping
            db.Article.create(result)
            .then(function(dbArticle){
                //View the added result in console
                console.log(dbArticle);
            })
            .catch(function(err){
                //If error, log
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});

app.get("/articles", function(req, res){
    //Grab every document in the Articles Collection
    db.Article.find({})
        .then (function (dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

//Start server
app.listen(PORT, function () {
    console.log("App running on port "+PORT);
});