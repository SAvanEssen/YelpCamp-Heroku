var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - Show all campgrounds
router.get("/", function (req, res) {
  // Get all campgrounds from DB.
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
  // //First part of {campgrounds: campgrounds} can be any name you want it to be.
});

//CREATE - Add new campground to database
router.post("/", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  // Create new campground and save to database.
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to the campgrounds page
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

// campgrounds.push(newCampground);
// campAdd.create(data, (err, campgrounds)=>{
//     if(err){
//         console.log(err)
//     } else {
//         console.log("happydays")
//     }
// });

// NEW - Show form to create new campground.
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

// SHOW - Shows more info about one campground
router.get("/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        // console.log("req.params.id")
        // console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
  // req.params.id
  // render show template with that campground
  // res.render("show");

  // res.send("THIS WILL BE THE SHOW PAGE ONE DAY!");
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (
  req,
  res
) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY CAMPGROUND ROUTES
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
