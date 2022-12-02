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

router.get("/productview/:id",userController.productView)

router.get("/addFavorite/:id",usercontroller.addFavorite)

router.get("/favorite",session.verifyUser,userController.getFavorite)

router.get("/cart",session.verifyUser,userController.getCart)

router.get("/addcart/:id",userController.addTocart)

router.post("/changeQuantity",userController.changeQuantity)

router.post("/removeProduct",userController.removeProduct)

router.get("/profile",session.verifyUser,userController.profile)

router.post("/submitAddress",userController.submitAddress)
 
router.post("/changeAddress",usercontroller.changeAddress)

router.get('/changePassword',session.verifyUser,userController.getChangepass)

router.post('/changePass',userController.postChangepass)

router.post("/removeFavorite",userController.removeFavorite)



module.exports = router;
