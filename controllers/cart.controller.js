const { render } = require("ejs");
const validationResult = require("express-validator").validationResult;
const { CartItem } = require("../models/cart.model");
const mongoose = require("mongoose");
const { Result } = require("express-validator");
const responseMsg = require("../configurations/status_code/result");
const { json } = require("body-parser");
const DB_URL = "mongodb://127.0.0.1:27017/shop";

// work seccessfully
exports.getCart = (req, res, next) => {
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
          cartItems: cartItems.filter((data) => data.status === "pending"),
          isUser: req.session.userId,
          isAdmin: req.session.isAdmin,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: responseMsg.ERR_SYSTEM,
        });
      });
  } catch (err) {
    res.status(500).json({
      error: responseMsg.ERR_SYSTEM,
    });
  }
};

// work seccessfully
exports.postCart = (req, res, next) => {
  if (req.body.productId) {
    if (validationResult(req).isEmpty()) {
      mongoose
        .connect(DB_URL)
        .then(async () => {
          await CartItem.findOne({
            userId: req.session.userId,
            productId: req.body.productId,
            status: "pending",
          }).then(async (result) => {
            if (result) {
              console.log(result);
              await CartItem.updateOne(
                {
                  productId: req.body.productId,
                  userId: req.session.userId,
                  _id: result._id,
                },
                {
                  quantity: Number(result.quantity) + Number(req.body.quantity),
                }
              ).then((result) => {
                console.log(result);
                return;
              });
            } else {
              if (req.body.productId) {
                let item = new CartItem({
                  name: req.body.name,
                  price: req.body.price,
                  quantity: req.body.quantity,
                  userId: req.session.userId,
                  productId: req.body.productId,
                  timeStamp: Date.now(),
                });
                return item.save();
              } else {
                return res.status(422).json({
                  meg: responseMsg.INVALID_INPUT,
                  content: "There is no any prodecut sent",
                });
              }
            }
          });
        })
        .then(() => {
          mongoose.disconnect();
          res.status(200).redirect("/cart");
        })
        .catch((err) => {
          mongoose.disconnect();
          res.status(500).json({
            error: res.ERR_SYSTEM,
          });
        });
    } else {
      console.log("ther is an error  empty");
      req.flash("validationErrors", validationResult(req).array());
      res.status(422).json({
        meg: responseMsg.INVALID_INPUT,
        content: validationResult(req).array(),
      });
    }
  } else {
    return res.status(409).json({
      meg: responseMsg.ERR_409_CONFLICT
    });
  }
};

// work seccessfully
exports.updateCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let result = CartItem.updateOne(
          { _id: req.body.cartId },
          {
            quantity: req.body.quantity,
            timeStamp: new Date(),
          }
        ).then(() => {
          return;
        });
      })
      .then(() => {
        res.status(200).redirect("/cart");
      })
      .catch((err) => {
        res.status(500).json({
          error: responseMsg.ERR_SYSTEM,
        });
      });
  } else {
    req.flash("quantityFlashError", validationResult(req).array());
    console.log(validationResult(req).array());
    res.status(422).json({
      msg: responseMsg.INVALID_INPUT,
    });
  }
};

// work seccessfully
exports.addInToOrders = (req, res, next) => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "order",
        }
      ).then(() => {
        return;
      });
    })
    .then(() => {
      res.status(200).redirect("/cart");
    })
    .catch((err) => {
      res.status(500).json({
        error: responseMsg.ERR_SYSTEM,
      });
    });
};

// work seccessfully
exports.postDeleteItemCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let result = CartItem.findByIdAndDelete(req.body.cartId).then(() => {
          return;
        });
      })
      .then(() => {
        res.status(200).redirect("/cart");
      })
      .catch((err) => {
        res.status(500).json({
          error: responseMsg.ERR_SYSTEM,
        });
      });
  } else {
    res.status(200).redirect("/cart");
  }
};
