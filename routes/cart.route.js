const router = require("express").Router();
const bodyParser = require("body-parser");

const protection = require("./protections/auth.protections");
const check = require("express-validator").check;
const cartController = require("../controllers/cart.controller");
// work seccessfully
router.post(
  "/",
  protection.isAuth,
  bodyParser.urlencoded({ extended: true }),
  check("quantity").isInt({ min: 1 }).withMessage("Quantity not found "),
  cartController.postCart
);
// work seccessfully
router.post(
  '/update' ,
   protection.isAuth ,
 bodyParser.urlencoded({extended:true}),
 check('quantity').isInt({ min: 1 }).withMessage("Quantity must be greater than 0 "),
 cartController.updateCart
);

// work seccessfully
router.post('/addToOrders' , protection.isAuth , 
bodyParser.urlencoded({extended:true}) , 
cartController.addInToOrders)


// work seccessfully
router.post(
  '/delete' ,
   protection.isAuth ,
 cartController.postDeleteItemCart
);


// work seccessfully
router.get("/", protection.isAuth ,cartController.getCart);

 module.exports = router;
  
 