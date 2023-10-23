const router = require("express").Router();
const bodyParser = require("body-parser");
const isAuth = require("./protections/auth.protections");

const homeController = require("../controllers/home.controller");
router.get("/", (req, res, next) => {
  res.status(404).json({
    msg: " This request is not found !",
  });
});
router.get("/home", isAuth.isAuth, homeController.getHome);

module.exports = router;
