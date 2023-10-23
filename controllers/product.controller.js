const Product = require("../models/products.model");
const mongoose = require("mongoose");
const DB_URL = "mongodb://127.0.0.1:27017/shop";
const responseMsg = require("../configurations/status_code/result");

exports.getProduct = (req, res, next) => {
  let id = req.params.id;
  try {
    mongoose
      .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        console.log("Connected to MongoDB successfully");

        const product = await Product.findById(id);
        mongoose.connection.close();
        return res.status(200).json({
          product: product,
          isUser: req.session.userId,
          isAdmin: req.session.isAdmin,
          validationErrors: req.flash("validationErrors")[0],
        });
      })
      .catch((error) => {
        res.status(500).json({
          err: responseMsg.ERR_INTERNAL_SERVER,
        });
      });
  } catch (err) {
    res.status(503).json({
      err: responseMsg.ERR_UNAVAILABLE,
    });
  }
};
