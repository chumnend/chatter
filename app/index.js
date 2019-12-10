const express = require("express");
const morgan = require("morgan");
const config = require("../config");
const socketWrapper = require("./socket");

// initilaize the application
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
if( config.NODE_ENV !== 'test') {
    app.use(morgan("common"));
}

// setup application routes
app.get("/", (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

module.exports = socketWrapper(app);
