const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const { Db } = require("mongodb");
const config = require("../configurations/db/db.config");
const responseMsg = require("../configurations/status_code/result");
const DB_URL = config.DB_URL;

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", userSchema);
exports.User = User;
exports.createNewUser = (username, email, password) => {
  // check if email is found
  // yes or error
  //no create new account

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
          reject("FOUNDEd");
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hashPassword) => {
        let user = new User({
          username: username,
          email: email,
          password: hashPassword,
        });
        return user.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          console.log("no user with this email")
          reject(responseMsg.ERR_EMAIL);
        } else {
          bcrypt.compare(password, user.password).then((same) => {
            if (!same) {
              reject(responseMsg.ERR_PASSWORD);
            } else {
              mongoose.disconnect();
              resolve({
                id: user._id,
                isAdmin: user.isAdmin,
              });
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(responseMsg.ERR_SYSTEM);
      });
  });
};
