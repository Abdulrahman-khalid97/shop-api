const authModel = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;
const responseMsg = require("../configurations/status_code/result");
const { Result } = require("express-validator");
// work seccessfully
exports.getSignUp = (req, res, next) => {
  res.status(404).json({
    msg: "There is no simillar request !",
  });
};

// work seccessfully
exports.postSignUp = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    authModel
      .createNewUser(req.body.username, req.body.email, req.body.password)
      .then(() => {
        res.status(200).json({
          msg: responseMsg.SUCCESS,
          data: {
            email: req.body.email,
          },
        });
      })
      .catch((err) => {
        if (err.trim() === "FOUNDED") console.log(err);
        res.status(409).json({
          msg: responseMsg.EMAIL_FOUNDED,
        });
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    console.log(validationResult(req).array());
    res.status(422).json({
      meg: responseMsg.INVALID_INPUT,
      content: validationResult(req).array(),
    });
  }
};

// work seccessfully
exports.getLogin = (req, res, next) => {
  res.status(404).json({
    msg: responseMsg.NOT_FOUND,
  });
};

// work seccessfully
exports.postLogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    authModel
      .loginUser(req.body.email, req.body.password)
      .then((resolve) => {
        req.session.userId = resolve.id;
        req.session.isAdmin = resolve.isAdmin;

        // return res.redirect("/home");
        return res.status(200).json({
          msg:responseMsg.SUCCESS
        })
      })
      .catch((err) => {
        req.flash("authError", err);
        if(err===responseMsg.ERR_EMAIL)
        res.status(401).json({
          msg: responseMsg.ERR_EMAIL,
        });
        else if(err===responseMsg.ERR_PASSWORD)
        res.status(401).json({
          msg: responseMsg.ERR_PASSWORD,
        });
        else
        res.status(500).json({
          msg: responseMsg.ERR_SYSTEM,
        });

      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.status(422).json({
      meg: responseMsg.INVALID_INPUT,
      content: validationResult(req).array(),
    });
  }
};

// work seccessfully
exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.status(200).json({
      msg: responseMsg.SUCCESS,
    });
  });
};
