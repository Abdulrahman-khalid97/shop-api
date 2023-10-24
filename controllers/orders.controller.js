const validationResult = require("express-validator").validationResult;
const { CartItem } = require("../models/cart.model");
const mongoose = require("mongoose");
const { Result } = require("express-validator");
const DB_URL = "mongodb://127.0.0.1:27017/shop";
const responseMsg = require("../configurations/status_code/result");

exports.getOrders = (req, res, next) => {
  try {
    mongoose
      .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        console.log("Connected to MongoDB successfully");

        const cartItems = await CartItem.find(
          { userId: req.session.userId },
          {},
          { sort: { timeStamp: 1 } }
        );
        mongoose.connection.close();

        return res.status(200).json({
          orderedItemsorders: cartItems.filter(
            (data) => data.status === "order"
          ),
          isUser: req.session.userId,
          isAdmin: req.session.isAdmin,
          // quantityError: req.flash("quantityFlashError")[0],
          // validationErrors: req.flash("validationErrors")[0],
        });
      })
      .catch((error) => {
        res.status(500).json({
          msg: responseMsg.ERR_INTERNAL_SERVER,
        });
      });
  } catch (err) {
    console.log("There is error with order  " + err);
    res.status(500).json({
      msg: responseMsg.ERR_INTERNAL_SERVER,
    });
  }
};

exports.unOrder = (req, res, next) => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "pending",
        }
      ).then((result) => {
        if (result.modifiedCount === 0)
          res.status(202).json({
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            msg: responseMsg.ERR_NOT,
          });
        else if (result.modifiedCount != 0) {
          res.status(200).json({
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            msg: responseMsg.SUCCESS,
          });
        }
      });
    })
    .catch((err) => {
      console.log("Edit Items Error : ", err);
      res.status(500).json({
        msg:responseMsg.ERR_INTERNAL_SERVER
      });
    });
};
