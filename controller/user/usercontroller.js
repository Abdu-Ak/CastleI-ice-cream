const bcrypt = require("bcrypt");
const userdetails = require("../../model/signUp");
const productdetails = require("../../model/product");
const { default: mongoose } = require("mongoose");
const cart = require("../../model/cart");
const mail = require ('../../middleware/otp')
const { count } = require("../../model/signUp");
const { response } = require("../../app");
const favorite = require("../../model/favorite");
const  category  = require("../../model/category");
const order = require("../../model/order")
const moment = require("moment");
const { instance } = require("../../middleware/razorPay");
const crypto = require("crypto");
const otp = require("../../model/otp");
const { invalid } = require("moment");


var favCount;
var cartCount;
var totalAmount;


module.exports = {
  landing: async (req, res) => {
     try {
      user = req.session.user;
    let products = await productdetails.find();
    
    res.render("user/index", { user, products , cartCount , favCount});
     } catch (error) {
      console.log(error);
      res.render('500')
     }
  },

  home: async (req, res) => {
    try {
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
      let favData = await favorite.find({userId : userData._id })
      
      if (favData.length) {
        favCount = favData[0].product.length
      } else {
        favCount =0;
      }
      
      res.render("user/index", { user, products , cartCount , favCount });
    } else {
      res.render("user/userLogin");
    }
    } catch (error) {
      console.log(error);
      res.render('500');
    }
  },

  getLogin: (req, res) => {
   try {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.render("user/userLogin");
    }
   } catch (error) {
    console.log(error);
    res.render('500');
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
      res.render('500');
    }
  },

  getSignUp: (req, res) => {
   try {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      res.render("user/Signup");
    }
   } catch (error) {
    console.log(error);
    res.render('500');
   }
  },

  postSignup: async (req, res) => {

    try {
     let   data =req.body;
    
      let mailDetails = {
        from: process.env.GMAIL,
        to: data.email,
        subject: "CASTLE ICE CREAMS VERIFICATION",
        html: `<p>YOUR OTP FOR REGISTERING IN CASTLE  IS <h1> ${mail.OTP} <h1> </p>`,
      }; 
      if (req.body.password === req.body.confirmpassword) {
        userdetails
          .find({  $or: [{ username: data.username }, { email: data.email }, { phonenumber: data.phonenumber }], })
          .then((result) => {
            if (result.length) {
              res.render("user/signup", {
                err_msg: "Details already existed...!",
              });
            } else {
            
               mail.mailTransporter.sendMail(mailDetails,(err,Data)=>{
                  if (err) {
                    console.log('error occurs');
                    
                  } else {
                    const newOtp = new otp({
                      otp: mail.OTP,
                    });
                    newOtp.save().then(()=>{
                     
                      res.render('user/otpSignup' , {data})
                    
                    })
                   
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
      res.render('500');

    }

  },
  otpsignup : async (req,res)=>{
    try {
      const data = req.body;
      console.log(data);
     if (data.otp) {
      const verify = await otp.find({ otp: data.otp });
      if (verify) {
        otp.deleteMany({otp : data.otp}).then(()=>{
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
            
        })
        
       } else {
         res.render("user/otpSignup", {
         
           data,
           err_msg: "invalid otp..!",
         });
       }
       
     } else {
      res.render("user/otpSignup", {
         
        data,
        err_msg: "Enter your  otp ..!",
      });
     } 
     
    } catch (error) {
      console.log(error);
      res.render('500');
    }
  },
    
 forgotPass :  (req,res)=>{
   try {
    res.render('user/forgotPass')
   } catch (error) {
    console.log(error);
    res.render('500');
   }
 },
   postForgotpass : async (req,res)=>{
   try {
    let data = req.body;
     

   let userData = await userdetails
         .findOne({  $or: [{ username: data.details }, { email: data.details }, { phonenumber: data.details }], })
         if (userData) {
          console.log(userData);
          let mailDetails = {
            from:process.env.GMAIL,
            to: userData.email,
            subject: "CASTLE ICE CREAMS VERIFICATION",
            html: `<p>YOUR OTP FOR RESET PASSWORD IS <h1> ${mail.OTP} <h1> </p>`,
            
          };
         mail.mailTransporter.sendMail(mailDetails,(err,Data)=>{
          
            if (err) {
              console.log('error occurs');
              
            } else {
              const newOtp = new otp({
                otp: mail.OTP,
              });
              newOtp.save().then(()=>{
                
                res.render('user/forgotPassOtp' , {data})
              
              })
             
            }
          })
         } else {
          res.render('user/forgotPass',{
            err_msg : 'invalid username or email...!'
          })
         }
   } catch (error) {
    console.log(error);
    res.render('500');
   }
   },

  forgotpassOtp : (req,res)=>{
     try {
       let data = req.body;
        
       if (data.otp) {
        otp.find({otp : data.otp}).then((result)=>{
          if (result) {
            otp.deleteMany({otp : data.otp}).then(()=>{
              res.render('user/resetPass',{data})
            })
            
          } else {
            res.render('user/forgotPassOtp' , {
              data,
              err_msg : "invalid OTP..!"
            })
          }
         })

       } else {
         res.render('user/forgotPassOtp' , {
               data,
              err_msg : "Enter your  OTP..!"
            })
       }

     } catch (error) {
      console.log(error);
      res.render('500');
     }


  },   
  resetPass : async (req,res)=>{
   try {
    let data= req.body;
    if (data.newpassword && data.confirmpassword ) {
      if (data.newpassword === data.confirmpassword) {
        let newPassword = await bcrypt.hash(data.newpassword, 10)
        
        userdetails.updateOne( {  $or: [{ username: data.details }, { email: data.details }, { phonenumber: data.details }], },
          {
            $set:{
              password:newPassword
            }
          }
          ).then(()=>{
            res.redirect('/login')
          })
        
      } else {
        res.render('user/resetPass',{data,
          err_msg : "  Password must be same..!"
        })
      }
      
    } else {
      res.render('user/resetPass',{data,
        err_msg : " You must enter Password..!"
      })
    }
   } catch (error) {
    console.log(error);
    res.render('500');
   }
    
  },

  productView: async (req, res) => {
   try {
    let user = req.session.user;
    const id = req.params.id;
    let product = await productdetails.findOne({ _id: id });
    
    res.render("user/productView", { user, product ,cartCount , favCount});
   } catch (error) {
    console.log(error);
    res.render('500');
   }
  },

  product: async (req, res) => {
   try {
    let user = req.session.user;
    let products = await productdetails.find();
    let categories = await category.find()
    
    res.render("user/product", { user, products , cartCount ,favCount ,categories });
   } catch (error) {
    console.log(error);
    res.render('500');
   }
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
      
      res.render("user/favorite", { user , productData , cartCount , favCount })


    } catch (error) {
      console.log(error);
      res.render('500');
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
        
          // await cart.aggregate([
          //   {
          //     $unwind : "$product"
          //   },
          // ]);
          
          // await cart.updateOne(
          //   {userId : userData._id, "product.productId": objId},
          //   {$inc : {"product.$.quantity" : 1 }}
          // )
          res.json({productEx : true})
          
        }else{
         
          
           
                cart.updateOne({userId : userData._id},{$push : {product : productOb }}).then(()=>{
                  favorite.updateOne({userId : userData._id}, { $pull: { product: { productId: objId } } }).then(()=>{
                    res.json({ status: true });
                  })
                 
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
    } catch (error) {
      console.log(error);
      res.render('500');
    }
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
        console.log(productData);
        const sum = productData.reduce((accumulator, object) => {
          return accumulator + object.productPrice;
        }, 0);
        
       cartCount = productData.length;
      res.render("user/cart", { user, productData  ,sum, cartCount ,favCount});
      console.log(cartCount);
    } catch (error) {
      console.log(error);
      res.render('500');
    }
  },
  changeQuantity : async (req,res)=>{
   try {
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
   } catch (error) {
    console.log(error);
      res.render('500');
   }

  },
  removeProduct : async (req,res)=>{
    try {
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
    } catch (error) {
      console.log(error);
      res.render('500');
    }
  },
 
  profile : async (req,res)=>{
   try {
    let user =req.session.user
    let userData = await userdetails.findOne({$or: [{ username: user }, { email: user }, { phonenumber: user }]})
    console.log(userData);
    res.render('user/profile',{ user , cartCount,userData , favCount} )
   } catch (error) {
    console.log(error);
    res.render('500');
   }
  },

  submitAddress : (req,res)=>{
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
      { primaryaddress : addressObj}}).then((data)=>{
    
      res.redirect('/profile')
     })
   } catch (error) {
    console.log(error);
    res.render('500');
   }
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
    console.log(error);
    res.render('500');
   }
  },
 getChangepass : (req,res)=>{
 try {
  let user = req.session.user
  res.render('user/changePass',{user,cartCount , favCount})
 } catch (error) {
  console.log(error);
    res.render('500');
 }

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
    console.log(error);
    res.render('500');
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
         
       
          res.json({ result: false });
        

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
    console.log(error);
    res.render('500');
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
    console.log(error);
    res.render('500');
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
    console.log(error);
    res.render('500');
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
    console.log(error);
    res.render('500');
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
  console.log(error);
  res.render('500');
 }
 },
 
 postCheckout : async (req,res)=>{
 try {
  let data = req.body

  let user = req.session.user;
  let userData = await userdetails.findOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }]});
  let cartData = await cart.findOne({userId : userData._id});
  
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
      orderStatus : "placed",
      paymentMethod : data.paymentMethod,
      paymentStatus : "Not paid",
      orderdate: moment().format("MMM Do YY"),
    });
    const amount = orderData.totalAmount * 100;
    const _id = orderData._id;
    await cart.deleteOne({ userId: userData._id });
    if(data.paymentMethod === "COD"){
    
        res.json({success : true});
        
    }else if(data.paymentMethod === "online"){
      let options = {
        amount: amount,
        currency: "INR",
        receipt: "" + _id,
      };
      instance.orders.create(options,(err,order)=>{
      
        if (err) {
          console.log(err);
        } else {
          res.json(order);
        
          
        }
      });
    }

  }else{
    res.redirect("/cart")
  }

 } catch (error) {
  console.log(error);
  res.render('500');
 }
  
},

verifyPayment :(req,res)=>{
  try {
    const details = req.body;
  
    let hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
    hmac.update(
     details.payment.razorpay_order_id +
       "|" +
       details.payment.razorpay_payment_id
   );
   hmac = hmac.digest("hex");
   if (hmac == details.payment.razorpay_signature) {
     const objId = mongoose.Types.ObjectId(details.order.receipt);
     console.log(objId);
     order
       .updateOne({ _id: objId }, { $set: { paymentStatus: "paid" } })
       .then(() => {
         res.json({ success: true });
         
       })
       .catch((err) => {
         console.log(err);
         res.json({ status: false });
       });
   } else {
     res.json({ status: false });
   }
  } catch (error) {
    console.log(error);
    res.render('500');
  }
},
paymentFail : (req,res)=>{
  try {
    let user= req.session.user;
  res.render('user/paymentFail',{ favCount , cartCount , user })
  } catch (error) {
    console.log(error);
    res.render('500');
  }
},
  getSuccess : (req,res)=>{
   try {
    let user= req.session.user;
    res.render('user/orderSuccess',{ favCount , cartCount , user })
   } catch (error) {
    console.log(error);
    res.render('500');
   }
  },

  getOrderlist :async (req,res)=>{
   try {
    let user= req.session.user;
    const userData = await userdetails.findOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }]}); 
    const orderData = await order.aggregate([
      {
        $match : { userId : userData._id},
      },
      {
        $lookup : {
          from : "productdetails",
          localField : "orderItem.productId",
          foreignField : "_id",
          as : "productDetail",
        },
      },
      

    ])
 
   console.log(orderData);
    
    res.render('user/orderList',{ favCount , cartCount , user , orderData, userData })
   } catch (error) {
    console.log(error);
    res.render('500');
   }
  },

  cancelOrder : (req,res) => {
    try {
      const id = req.params.id;
      order.updateOne({_id : id},{$set : {orderStatus: 'Cancelled'}}).then(()=>{
       res.redirect('/orderList')
      })
    } catch (error) {
      console.log(error);
    res.render('500');
    }
     
  },
  
  addDp : async (req,res)=>{
        try {
          let user = req.session.user;
          const image = {
            url :req.file.path,
            filename : req.file.filename
          }
         
          let userdata = await userdetails.findOne({ $or: [{ username: user }, { email: user }, { phonenumber: user }]});
          userdetails.updateOne({_id : userdata.id},{$set : {image : image }}).then(()=>{

           res.redirect("/profile")
            
          })
        } catch (error) {
          console.log(error);
          res.render('500');
        }
  },




  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
