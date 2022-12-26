const express = require("express");
const multer = require("multer");
const usercontroller = require("../controller/user/usercontroller");
const router = express.Router();
const userController = require("../controller/user/usercontroller");
const { verifyUser } = require("../middleware/session");
const { storage , cloudinary } = require('../middleware/cloudinary');
const upload = multer({storage});



router.get("/", userController.landing);

router.get("/home",verifyUser,userController.home);

router.get("/login", userController.getLogin);

router.post("/doLogin", userController.doLogin);

router.get("/logout", userController.logout);

router.get("/signup", userController.getSignUp);

router.post("/submit", userController.postSignup);

router.post("/submitOtp", userController.otpsignup);

router.get("/product",userController.product)

router.get('/forgotPass',userController.forgotPass)

router.post('/postForgotpass',userController.postForgotpass)

router.post('/forgotpassOtp',userController.forgotpassOtp)

router.post('/resetPass',userController.resetPass)

router.get("/productview/:id",verifyUser,userController.productView)

router.get("/addFavorite/:id",verifyUser,usercontroller.addFavorite)

router.get("/favorite",verifyUser,userController.getFavorite)

router.get("/cart",verifyUser,userController.getCart)

router.get("/addcart/:id",verifyUser,userController.addTocart)

router.post("/changeQuantity",verifyUser,userController.changeQuantity)

router.post("/removeProduct",verifyUser,userController.removeProduct)

router.get("/profile",verifyUser,userController.profile)

router.post("/submitAddress",verifyUser,userController.submitAddress)
 
router.post("/changeAddress",verifyUser,usercontroller.changeAddress)

router.get('/changePassword',verifyUser,userController.getChangepass)

router.post('/changePass',verifyUser,userController.postChangepass)

router.post("/removeFavorite",verifyUser,userController.removeFavorite)

router.get("/filter/:id",userController.filterPro);

router.post("/search",userController.search)

router.post("/checkOut",verifyUser,userController.getCheckout)

router.post("/secAddress",verifyUser,usercontroller.postSecAddress);

router.post("/checkOrder",userController.postCheckout);

router.get("/orderSuccess",verifyUser,userController.getSuccess);

router.get("/orderList",verifyUser,usercontroller.getOrderlist);

router.post("/verifyPayment",verifyUser,usercontroller.verifyPayment)

router.get("/paymentFail",verifyUser, userController.paymentFail)

router.get("/cancelOrder/:id",verifyUser,userController.cancelOrder)

router.post('/submitDp',verifyUser,upload.single('image'),usercontroller.addDp)

router.post('/applyCoupon',verifyUser,userController.applyCoupon)


module.exports = router;
