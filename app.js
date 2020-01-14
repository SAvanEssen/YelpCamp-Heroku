var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Requiring Routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

console.log(process.env.DATABASEURL);

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v13Deployed"

mongoose.connect(process.env.DATABASEURL);
// const connectionString = "mongodb://localhost/yelp_camp_v13Deployed";
// const connectionString = "mongodb+srv://save_73:<1mNTzmtEs5a3Au9I>@cluster0-u1ko3.azure.mongodb.net/test?retryWrites=true&w=majority";
// mongoose.connect(
//   connectionString,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err) {
//     console.log("Database werkend?");
//   }
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Starting to dislike Rusty",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_333,q_75,w_500/https://assets.simpleviewinc.com/simpleview/image/upload/crm/lanecounty/salmon-creek-campground-by-colin-morton-2018-14--54a7f39c5056b3a_54a8010b-5056-b3a8-49a1afccddf9b8ab.jpg",
//         description: "This is a salmon rich creek, no bathrooms, sweet water, beautifull fishingground for bears!"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND:");
//             console.log(campground);
//         }
//     });

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_333,q_75,w_500/https://assets.simpleviewinc.com/simpleview/image/upload/crm/lanecounty/salmon-creek-campground-by-colin-morton-2018-14--54a7f39c5056b3a_54a8010b-5056-b3a8-49a1afccddf9b8ab.jpg"},
//     {name: "Granite Hill", image: "https://media-cdn.tripadvisor.com/media/photo-s/02/32/e1/7e/entry-sign.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2017/02/08/08/46/animal-2048162_1280.jpg"}
// ]

app.listen(process.env.PORT, process.env.IP, function () {
  console.log("The YelpCamp server has started");
});