const { render } = require("ejs");
const Product = require("../models/products.model");
const validationResult = require("express-validator").validationResult;
const mongoose = require("mongoose");
const config = require("../configurations/db/db.config");
const DB_URL = "mongodb://127.0.0.1:27017/shop";
const { CartItem } = require("../models/cart.model");
const { User } = require("../models/auth.model");
const responseMsg = require("../configurations/status_code/result");

exports.getAdd = (req, res, next) => {
  res.status(400).json({
    msg: responseMsg.BAD_REQUEST,
  });
};

//// work seccessfully

exports.getManageOrder = (req, res, next) => {
  try {
    mongoose
      .connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log("Connected to MongoDB successfully");
        const users = await User.find();
        const cartItems = await CartItem.find();

        mongoose.connection.close();
        //    console.log("Cart Render :", cartItems);
        return res.status(200).json({
          isUser: req.session.userId,
          isAdmin: req.session.isAdmin,
          orderItems: cartItems.filter((data) => data.status === "order"),
          sentItems: cartItems.filter((data) => data.status === "sent"),
          complateItems: cartItems.filter((data) => data.status === "complate"),
        });
      })
      .catch((err) => {
        mongoose.connection.close();
        res.status(503).json({
          error: responseMsg.ERR_HANDLE,
        });
      });
  } catch (err) {
    mongoose.connection.close();
    res.status(500).json({
      error: responseMsg.ERR_INTERNAL_SERVER,
    });
  }
};
//// work seccessfully
exports.sentOrder = async (req, res, next) => {
  await mongoose
    .connect(config.DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "sent",
        }
      )
        .then((result) => {
          console.log(result);
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
        })
        .catch((err) => {
          res.status(503).json({
            update: responseMsg.ERR_HANDLE,
          });
        });
    })
    .catch((err) => {
      console.log("Edit Items Error : ", err);
      res.status(500).json({
        isAuth: req.session.userId,
        isAdmin: req.session.isAdmin,
        update: responseMsg.ERR_INTERNAL_SERVER,
      });
    });
};

//// work seccessfully
exports.complate = async (req, res, next) => {
  await mongoose
    .connect(config.DB_URL)
    .then(() => {
      let result = CartItem.updateOne(
        { _id: req.body.cartId },
        {
          status: "complate",
        }
      )
        .then((result) => {
          console.log(result);
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
        })
        .catch((err) => {
          res.status(503).json({
            update: responseMsg.ERR_HANDLE,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: responseMsg.ERR_INTERNAL_SERVER,
      });
    });
};

//// work seccessfully
exports.postAdd = (req, res, next) => {
  console.log(req.flash("validationErrors"));
  if (validationResult(req).array().length != 0) {
    req.flash("validationErrors", validationResult(req).array());
    res.json({
      validationErrors: req.flash("validationErrors"),
      isUser: true,
      isAdmin: true,
    });
  } else {
    // console.log(req.file);
    mongoose
      .connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        let product = Product({
          name: req.body.name,
          price: req.body.price,
          category: req.body.category,
          description: req.body.description,
          image: req.file.filename,
        });
        return product.save();
      })
      .then((result) => {
        if (result) {
          res.status(200).json({
            validationErrors: req.flash("validationsErrors"),
            isUser: true,
            isAdmin: true,
          });
        } else {
          res.status(200).json({
            isAuth: req.session.userId,
            isAdmin: req.session.isAdmin,
            msg: responseMsg.SUCCESS,
          });
        }
      })
      .catch((err) => {
        res.status(503).json({
          error: responseMsg.ERR_HANDLE,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: responseMsg.ERR_INTERNAL_SERVER,
        });
      });
  }
};
