// required modules //

const express = require("express");
const sessions = require("express-session");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const app = express();
const db = require("./config/connection");
require("dotenv").config();
const { preventCache } = require("./middleware/cache");

//setting view engine//
app.set("view engine", "ejs");

//serving public file
app.use(express.static(__dirname));


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
app.use("/admin", adminRouter);
app.use("/", userRouter);

app.use((req, res) => {
  res.status(404).render('404');
});




//  db
db.dbConnect();

//server creating//
app.listen(3000), ()=>{
  console.log('serving running');
}


module.exports = app;
