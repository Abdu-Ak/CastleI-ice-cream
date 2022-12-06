const express = require("express");
const usercontroller = require("../controller/user/usercontroller");
const router = express.Router();
const userController = require("../controller/user/usercontroller");
const session = require("../middleware/session")



router.get("/", userController.landing);

router.get("/home",session.verifyUser,userController.home);

router.get("/login", userController.getLogin);

router.post("/doLogin", userController.doLogin);

router.get("/logout", userController.logout);

router.get("/signup", userController.getSignUp);

router.post("/submit", userController.postSignup);

router.post("/submitOtp", userController.otpsignup);

router.get("/product",userController.product)

router.get("/productview/:id",session.verifyUser,userController.productView)

router.get("/addFavorite/:id",session.verifyUser,usercontroller.addFavorite)

router.get("/favorite",session.verifyUser,userController.getFavorite)

router.get("/cart",session.verifyUser,userController.getCart)

router.get("/addcart/:id",session.verifyUser,userController.addTocart)

router.post("/changeQuantity",session.verifyUser,userController.changeQuantity)

router.post("/removeProduct",session.verifyUser,userController.removeProduct)

router.get("/profile",session.verifyUser,userController.profile)

router.post("/submitAddress",session.verifyUser,userController.submitAddress)
 
router.post("/changeAddress",session.verifyUser,usercontroller.changeAddress)

router.get('/changePassword',session.verifyUser,userController.getChangepass)

router.post('/changePass',session.verifyUser,userController.postChangepass)

router.post("/removeFavorite",session.verifyUser,userController.removeFavorite)

router.get("/filter/:id",session.verifyUser,userController.filterPro);

router.get("/checkOut",session.verifyUser,userController.getCheckout)

router.post("/secAddress",session.verifyUser,usercontroller.postSecAddress);

router.post("/checkout",session.verifyUser,userController.postCheckout)

router.get("/orderSuccess",session.verifyUser,userController.getSuccess)

router.get("/orderList",session.verifyUser,usercontroller.getOrderlist)

module.exports = router;
