const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const config = require("../config");

// initilaize the application
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
if( config.NODE_ENV !== 'test') {
    app.use(morgan("common"));
}

// setup application routes
app.get("/", (req, res) => {
    res.send("Hello Word");
});

module.exports = app;