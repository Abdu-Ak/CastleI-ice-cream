const bcrypt = require("bcrypt");
const userdetails = require("../../model/signUp");
const productdetails = require("../../model/product");
const { default: mongoose } = require("mongoose");
const cart = require("../../model/cart");
const mailer = require("../../middleware/otp")
const { count } = require("../../model/signUp");
const { response } = require("../../app");
const favorite = require("../../model/favorite");
const  category  = require("../../model/category");
const order = require("../../model/order")
const moment = require("moment");
require("dotenv").config();

var favCount;
var cartCount;
var totalAmount;
let data;

module.exports = {
  landing: async (req, res) => {
     user = req.session.user;
    let products = await productdetails.find();
    res.render("user/index", { user, products , cartCount , favCount});
  },

  home: async (req, res) => {
    let user = req.session.user;
    let products = await productdetails.find();
    if (user) {
      let userData = await userdetails.findOne({  $or: [{ username: user }, { email: user }, { phonenumber: user }], })
      let cartData = await cart.find({userId : userData._id})
      if (cartData.length) {

      cartCount = cartData[0].product.length
      
      } else {

          cartCount=0;
         
      }
      let favData = await favorite.findOne({userId : userData._id })
      if (favData.length) {
        favCount = favData[0].product.length
        
      }else{

        favCount=0;

      }
      res.render("user/index", { user, products , cartCount , favCount });
    } else {
      res.render("user/userLogin");
    }
  },

  getLogin: (req, res) => {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.render("user/userLogin");
    }
  },

  doLogin: async (req, res) => {
    try {
      let user = req.body.details;
      let password = req.body.password;
       let userdata = await userdetails
        .find({
          $or: [{ username: user }, { email: user }, { phonenumber: user }],
        })
        
          if (userdata.length) {
            if (userdata[0].Status == false) {
              res.render("user/userLogin", {
                err_msg: "You were blocked by ADMIN...!",
              });
            } else {
              bcrypt.compare(password, userdata[0].password).then((value) => {
                if (value) {
                  req.session.user = user;
                  res.redirect("/home");
                } else {
                  res.render("user/userLogin", {
                    err_msg: "invalid password...!",
                  });
                }
              });
            }
          } else {
            res.render("user/userLogin", {
              err_msg: "invalid user details...!",
            });
          }
      
    } catch (error) {
      console.log(error);
    }
  },

  getSignUp: (req, res) => {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.render("user/Signup");
    }
  },

  postSignup: async (req, res) => {

    try {
       data =req.body;
      let mailDetails = {
        from: process.env.GMAIL,
        to: data.email,
        subject: "CASTLE ICE CREAMS VERIFICATION",
        html: `<p>YOUR OTP FOR REGISTERING IN CASTLE  IS <h1> ${mailer.OTP} <h1> </p>`,
      }; 
      if (req.body.password === req.body.confirmpassword) {
        userdetails
          .find({ username: data.username, email: data.email, phonenumber: data.phonenumber })
          .then((result) => {
            if (result.length) {
              res.render("user/signup", {
                err_msg: "Details already existed...!",
              });
            } else {
            
                mailer.mailTransporter.sendMail(mailDetails,(err,data)=>{
                  if (err) {
                    console.log('error occurs');
                    
                  } else {
                   console.log(data);
                    res.render('user/otpSignup' )

                  }
                })

            }
          });
      }else{
        res.render('user/Signup',{
          err_msg :" password must be same...!"
        })
      }
    } catch (error) {
      console.log(error);

    }

  },
  otpsignup : (req,res)=>{
    try {
      let otp = req.body.otp;
      console.log(otp);
      console.log(mailer.OTP);
      if (mailer.OTP == otp ) {
        
       bcrypt.hash(data.password, 10).then((password)=>{
      
        const newUser = new userdetails({
          username : data.username,
          email : data.email,
          phonenumber : data.phonenumber,
          password : password,
        });
        
        newUser.save().then(()=>{
          req.session.user = data.email;
          res.redirect("/home");
        })

       })
        
      } else {
        console.log('error');
      }
      
    } catch (error) {
      console.log(error);
    }
  },

  productView: async (req, res) => {
    let user = req.session.user;
    const id = req.params.id;
    let product = await productdetails.findOne({ _id: id });
    
    res.render("user/productView", { user, product ,cartCount , favCount});
  },

  product: async (req, res) => {
    let user = req.session.user;
    let products = await productdetails.find();
    let categories = await category.find()
    
    res.render("user/product", { user, products , cartCount ,favCount ,categories });
  },

  getFavorite: async (req, res) => {
    try {
      const user = req.session.user;
      const userData = await userdetails.findOne({
        $or: [{ username: user }, { email: user }, { phonenumber: user }],
      });
      
      const productData = await favorite
      .aggregate([
        {
          $match : { userId : userData.id },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
          
          },
        },
        {
          $lookup: {
            from: "productdetails",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $project: {
            productItem: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
          },
        },
      ])
      .exec();
      favCount = productData.length
      console.log(productData);
      res.render("user/favorite", { user , productData , cartCount , favCount })


    } catch (error) {
      
    }
  },
  addTocart: async (req, res) => {
    try {
      const id = req.params.id;
      const objId = mongoose.Types.ObjectId(id);
      const userId = req.session.user;

      let productOb = {
        productId: objId,
        quantity: 1,
      };
      const userData = await userdetails.findOne({
        $or: [{ username: userId }, { email: userId }, { phonenumber: userId }],
      });

      const userCart = await cart.findOne({ userId: userData._id });
      if (userCart) {
      
        let productEx = userCart.product.findIndex(
          (product) => product.productId == id
         
        );
        console.log(productEx);
        if (productEx != -1) {
        
          await cart.aggregate([
            {
              $unwind : "$product"
            },
          ]);
          
          await cart.updateOne(
            {userId : userData._id, "product.productId": objId},
            {$inc : {"product.$.quantity" : 1 }}
          )
          
          
        }else{
          cart.updateOne({userId : userData._id},{$push : {product : productOb }}).then(()=>{
            res.json({ status: true });
          })
        }
      } else {
        const newCart = new cart({
          userId: userData._id,
          product: [
            {
              productId: objId,
              quantity: 1,
            },
          ],
        });
        newCart.save().then((data) => {
           res.json({ status: true });
        });
      }
    } catch (error) {}
  },

  getCart: async (req, res) => {
    try {
      const user = req.session.user;
      const userData = await userdetails.findOne({
        $or: [{ username: user }, { email: user }, { phonenumber: user }],
      });

      const productData = await cart
        .aggregate([
          {
            $match: { userId: userData.id },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              productItem: "$product.productId",
              productQuantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: "productdetails",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $project: {
              productItem: 1,
              productQuantity: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
          },
          {
            $addFields: {
              productPrice: {
                $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
              },
            },
          },
        ])
        .exec();
    
        const sum = productData.reduce((accumulator, object) => {
          return accumulator + object.productPrice;
        }, 0);
        
       cartCount = productData.length;
      res.render("user/cart", { user, productData  ,sum, cartCount ,favCount});
      console.log(cartCount);
    } catch (error) {
      console.log(error);
    }
  },

  changeQuantity : async (req,res)=>{
    const data = req.body;
    
    const objId = mongoose.Types.ObjectId(data.product);
     await cart.aggregate([
      {
        $unwind : "$product"
      },
    ]);
    
     cart.updateOne(
      { _id: data.cart, "product.productId": objId },
      { $inc: { "product.$.quantity": data.count } }
    )
    .then(()=>{
      res.json({status : true})
      
    })

  },
  removeProduct : async (req,res)=>{
    const data = req.body;
    
    const objId = mongoose.Types.ObjectId(data.product);
     await cart.aggregate([
      {
        $unwind : "$product"
      },
    ]);
    await cart
    .updateOne(
      { _id: data.cart, "product.productId": objId },
      { $pull: { product: { productId: objId } } }
    )
    .then(() => {
      res.json({ status: true });
    });
  },
 
  profile : async (req,res)=>{
    let user =req.session.user
    let userData = await userdetails.findOne({$or: [{ username: user }, { email: user }, { phonenumber: user }]})
    
    res.render('user/profile',{ user , cartCount,userData , favCount} )
  },

  submitAddress : (req,res)=>{
    let user = req.session.user;
    data = req.body;
     addressObj = { 
      fullname   : data.fullname,
      phonenumber : data.phonenumber,
      email : data.email,
      pincode : data.pincode,
      locality : data.locality,
      address : data.address,
      district : data.district,
      state : data.state,
      landmark : data.landmark,

     }
    
     userdetails.updateOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }],},{$set:
      { primaryaddress : addressObj}}).then((data)=>{
    
      res.redirect('/profile')
     })
  },
  
  changeAddress :async (req,res)=>{
   try {
    const data =req.body
   let user = req.session.user
   addressObj = {
    fullname   : data.fullname,
    phonenumber : data.phonenumber,
    email : data.email,
    pincode : data.pincode,
    locality : data.locality,
    address : data.address,
    district : data.district,
    state : data.state,
    landmark : data.landmark,
   }
  
  console.log(data.fullname);
  await userdetails.updateOne( { email: user },
    {
      $set:{
        primaryaddress : addressObj
      }
    }
    ).then((hi)=>{
      console.log(hi);
    })
    
    res.redirect('/profile')
    
   } catch (error) {
    console.error();
   }
  },
 getChangepass : (req,res)=>{
 let user = req.session.user
  res.render('user/changePass',{user,cartCount , favCount})

 },
 postChangepass :async (req,res)=>{
  try {
    let data = req.body;
  let user = req.session.user;
  let userData = await userdetails.findOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }]})
 let value = await bcrypt.compare(data.currentpassword,userData.password)
  if (value) {
    if (data.newpassword === data.confirmpassword) {
     let check= await bcrypt.compare(data.newpassword,userData.password)
       if (check) {
        res.render('user/changePass',{
          err_msg : "New password must different from old one ....!"
        })
       } else {
        let newPassword = await bcrypt.hash(data.newpassword, 10)
        
        userdetails.updateOne( { email: userData.email },
          {
            $set:{
              password:newPassword
            }
          }
          ).then(()=>{
            res.redirect('/logout')
          })
        
       }
      
    } else {
      res.render('user/changePass',{
        err_msg : "Passwords must be SAME ....!"
      })
    }
  } else {
    res.render('user/changePass',{
      err_msg : "Current pasword WRONG....!"
    })
  }
    
   
  } catch (error) {
    console.error();
  }
 },

 addFavorite : async (req,res)=>{
  try {
    
    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id);
    const userId = req.session.user;

    let productOb = {
      productId: objId,
    
    };
    const userData = await userdetails.findOne({
      $or: [{ username: userId }, { email: userId }, { phonenumber: userId }],
    }); 
    const userFavorite = await favorite.findOne({ userId: userData._id });
    if (userFavorite) {

      let productEx = userFavorite.product.findIndex(
        (product) => product.productId == id
      );
      if (productEx != -1) {
         
        favorite.updateOne({userId : userData._id},{$pull : { product: { productId: objId } }}).then(()=>{
          res.json({ result: false });
        })


      }else{
        favorite.updateOne({userId : userData._id},{$push : {product : productOb }}).then(()=>{
          res.json({ result: true });
        })
         
      }
    } else {
      const newFavorite = new favorite({
        userId: userData._id,
        product: [
          {
            productId: objId,
          
          },
        ],
      });
      newFavorite.save().then((data)=>{
        res.json({result : true });
      })
    }
  } catch (error) {
    
  }
 },

 removeFavorite : async (req,res)=>{
  try {
    const data = req.body;
    console.log(data);
  const objId = mongoose.Types.ObjectId(data.product);
  await favorite.aggregate([
    {
      $unwind : "$product"
    },
  ]);
  await favorite
  .updateOne(
    { _id: data.fav, "product.productId": objId },
    { $pull: { product: { productId: objId } } }
  )
  .then(() => {
    res.json({ status: true });
  });

  } catch (error) {
    
  }
 },

 filterPro : async (req,res)=>{
  try {
    let user = req.session.user;
    let id =  req.params.id; 
    let categories = await category.find();
    let catData = await category.findOne({_id:id});
    let products = await productdetails.find({ Category : catData.Category });
    res.render("user/product", { user, products , cartCount ,favCount ,categories });
  } catch (error) {
    console.error();
  }
      
 },

 getCheckout : async (req,res)=>{
  try {
    let user = req.session.user;
  const userData = await userdetails.findOne({
    $or: [{ username: user }, { email: user }, { phonenumber: user }],
  });

  const productData = await cart
  .aggregate([
    {
      $match: { userId: userData.id },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        productItem: "$product.productId",
        productQuantity: "$product.quantity",
      },
    },
    {
      $lookup: {
        from: "productdetails",
        localField: "productItem",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $project: {
        productItem: 1,
        productQuantity: 1,
        productDetail: { $arrayElemAt: ["$productDetail", 0] },
      },
    },
    {
      $addFields: {
        productPrice: {
          $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
        },
      },
    },
  ])
  .exec();

  const sum = productData.reduce((accumulator, object) => {
    return accumulator + object.productPrice;
  },0);
  if(productData.length){
    res.render("user/checkOut",{user , favCount , cartCount , productData , userData , sum})
  }else{
    res.redirect('/cart')
  }
      
  } catch (error) {
    console.error();
  }
 },

 postSecAddress : (req,res)=>{
 try {
  let user = req.session.user;
  data = req.body;
   addressObj = { 
    fullname   : data.fullname,
    phonenumber : data.phonenumber,
    email : data.email,
    pincode : data.pincode,
    locality : data.locality,
    address : data.address,
    district : data.district,
    state : data.state,
    landmark : data.landmark,

   }
  
   userdetails.updateOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }],},{$set:
    { shippingAddress : addressObj}}).then((data)=>{
  
    res.redirect('/checkOut')
   })

 } catch (error) {
   console.error()
 }
 },
 
  postCheckout : async (req,res)=>{
      let data = req.body
      let user = req.session.user;
      let userData = await userdetails.findOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }]});
      let cartData = await cart.findOne({userId : userData._id});
      let status = data.paymentMethod === "COD" ? "placed" : "pending"
      let address;
      
      if(data.address === "primaryaddress"){
        address = userData.primaryaddress;
      
      }else{
        address = userData.shippingAddress;
        
      }
      if(cartData){
        const productData = await cart
        .aggregate([
          {
            $match: { userId: userData.id },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              productItem: "$product.productId",
              productQuantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: "productdetails",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $project: {
              productItem: 1,
              productQuantity: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
          },
          {
            $addFields: {
              productPrice: {
                $multiply: ["$productQuantity", "$productDetail.price"],
              },
            },
          },
        ])
        .exec();
      
        const sum = productData.reduce((accumulator, object) => {
          return accumulator + object.productPrice;
        }, 0);
        
        cartCount = productData.length;
       
        const orderData = await order.create({
          userId : userData._id,
          address : address,
          mobileNumber : userData.phonenumber,
          orderItem : cartData.product,
          totalAmount : sum,
          orderStatus : status,
          paymentMethod : data.paymentMethod,
          orderdate: moment().format("MMM Do YY"),
        });
        await cart.deleteOne({ userId: userData._id });
        if(data.paymentMethod === "COD"){
            res.json({status : true});
            console.log('woow');
        }else{
         console.log('fuck u...');
        }

      }else{
        res.redirect("/cart")
      }
    
      
  },

  getSuccess : (req,res)=>{
    let user= req.session.user;
     res.render('user/orderSuccess',{ favCount , cartCount , user })
  },

  getOrderlist :async (req,res)=>{
    let user= req.session.user;
    const userData = await userdetails.findOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }]}); 
    const orderData = await order.aggregate([
      {
        $match: { userId: userData._id },
      },
      {
        $unwind: "$orderItem",
      },
      {
        $project: {
          userId: "$userId",
          
          mobileNumber: "$mobileNumber",
          address: "$address",
          totalAmount: "$totalAmount",
          paymentMethod: "$paymentMethod",
          orderStatus: "$orderStatus",
          orderDate: "$orderdate",
          productItem: "$orderItem.productId",
          productQuantity: "$orderItem.quantity",
        },
      },
      {
        $lookup: {
          from: "productdetails",
          localField: "productItem",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          userId: 1,
      
          mobileNumber: 1,
          address: 1,
          totalAmount: 1,
          paymentMethod: 1,
          orderStatus: 1,
          orderDate: 1,
          productItem: 1,
          productQuantity: 1,
          productDetail: { $arrayElemAt: ["$productDetail", 0] },
        },
      },
      {
        $addFields: {
          productPrice: {
            $multiply: ["$productQuantity", "$productDetail.price"],
          },
        },
      },
    ]);

    console.log(orderData);
    res.render('user/orderList',{ favCount , cartCount , user , orderData })
  },
  
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
