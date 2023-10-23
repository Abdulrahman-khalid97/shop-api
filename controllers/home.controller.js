const { ConnectionStates } = require("mongoose");
// const productsModel = require("../models/products.model");
const Product = require("../models/products.model");
const mongoose = require("mongoose");
const DB_URL = "mongodb://127.0.0.1:27017/shop";
const responseMsg = require("../configurations/status_code/result");
let i = 0;

// work seccessfully
const getHome = (req, res, next) => {
  let category = req.query.category;
  if (category && category != "all") {
    try {
      mongoose
        .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
          console.log("Connected to MongoDB successfully");

          const products = await Product.find({ category: category });
          mongoose.connection.close();

          return res.status(200).json({
            isAdmin: req.session.isAdmin,
            isUser: req.session.userId,
            validationErrors: req.flash("validationErrors")[0],
            products: products,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: responseMsg.BAD_REQUEST,
          });
        });
    } catch (err) {
      console.log("Internal Server Error: ", err);
      res.status(500).json({
        error:responseMsg.ERR_INTERNAL_SERVER,
      });
    }
  } else {
    try {
      mongoose
        .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
          console.log("Connected to MongoDB successfully");
          const products = await Product.find({});
          mongoose.connection.close();

          return res.status(200).json({
            isAdmin: req.session.isAdmin,
            isUser: req.session.userId,
            validationErrors: req.flash("validationErrors")[0],
            products: products,
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: responseMsg.BAD_REQUEST,
          });
        });
    } catch (err) {
      console.log("Internal Server Error: ", err);
      res.status(500).json({
        error: responseMsg.ERR_INTERNAL_SERVER,
      });
    }
  }
};

module.exports = { getHome };
