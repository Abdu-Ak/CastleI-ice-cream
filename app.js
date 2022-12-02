// required modules //

const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const app = express();
const db = require("./config/connection")
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { preventCache } = require("./middleware/cache");


//setting view engine//
app.set("view engine", "ejs");

// file upllod //
app.use(fileUpload());

// session and cookie
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//to prevent cache storing

app.use(preventCache);

// parsing the incoming data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// router setting
app.use("/", userRouter);
app.use("/admin", adminRouter);

//serving public file
app.use(express.static(__dirname));



//  db 
db.dbConnect();

 //server creating//
 app.listen(3000)
  console.log("server running");
 
 

module.exports = app;
