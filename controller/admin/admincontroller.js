const admindetails = require("../../model/adminLogin");
const productdetails = require("../../model/product");
const userdetails = require("../../model/signUp");
const category = require("../../model/category");
const order = require("../../model/order");
const { default: mongoose } = require("mongoose");
const cart = require("../../model/cart");
const moment = require("moment");
const favorite = require("../../model/favorite");
const coupon = require("../../model/coupon");
const excelJs = require("exceljs");
require("fs");
const path = require("path");

module.exports = {
  getAdmin: async (req, res) => {
    try {
      const orderData = await order.find({ orderStatus: { $ne: "Cancelled" } });

      const totalRevenue = orderData.reduce((accumulator, object) => {
        return (accumulator += object.totalAmount);
      }, 0);

      const todayOrder = await order.find({
        orderStatus: { $ne: "Cancelled" },
        orderdate: moment().format("MMM Do YY"),
      });

      const todayRevenue = todayOrder.reduce((accumulator, object) => {
        return (accumulator += object.totalAmount);
      }, 0);

      const start = moment().startOf("month");
      const end = moment().endOf("month");
      const monthOrder = await order.find({
        orderStatus: { $ne: "Cancelled" },
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      const monthRevenue = monthOrder.reduce((accumulator, object) => {
        return (accumulator += object.totalAmount);
      }, 0);

      const placed = await order.find({
        orderStatus: "placed",
      });
      const shipped = await order.find({
        orderStatus: "shipped",
      });
      const delivered = await order.find({
        orderStatus: "delivered",
      });
      const cancelled = await order.find({
        orderStatus: "Cancelled",
      });

      const placedOrder = placed.length;
      const shippedOrder = shipped.length;
      const deliveredOrder = delivered.length;
      const cancelledOrder = cancelled.length;

      const cod = await order.find({
        paymentMethod: "COD",
      });
      const online = await order.find({
        paymentMethod: "online",
      });

      const codOrder = cod.length;
      const onlineOrder = online.length;

      res.render("admin/dash", {
        totalRevenue,
        todayRevenue,
        monthRevenue,
        placedOrder,
        shippedOrder,
        deliveredOrder,
        cancelledOrder,
        onlineOrder,
        codOrder,
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
  postAdminLogin: async (req, res) => {
    try {
      let admin = {
        username: "admin",
        password: 5378,
      };
      let user = req.body.username;
      let password = req.body.password;
      if (admin.username == user) {
        if (admin.password == password) {
          req.session.admin = user;
          res.redirect("/admin");
        } else {
          res.render("admin/adminLogin", {
            err_msg: "invalid  password....!",
          });
        }
      } else {
        res.render("admin/adminLogin", {
          err_msg: "invalid admin....!",
        });
      }
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  adminLogout: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/admin");
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  getusers: async (req, res) => {
    try {
      let user = await userdetails.find();
      res.render("admin/users", { user });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  blockUser: async (req, res) => {
    try {
      let id = req.params.id;

      await userdetails
        .findOneAndUpdate({ _id: id }, { $set: { Status: false } })
        .then(() => {
          res.redirect("/admin/getusers");
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  unblockUser: async (req, res) => {
    try {
      let id = req.params.id;

      await userdetails
        .findOneAndUpdate({ _id: id }, { $set: { Status: true } })
        .then(() => {
          res.redirect("/admin/getusers");
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  getAddproduct: (req, res) => {
    try {
      category.find().then((category) => {
        res.render("admin/addProduct", { category });
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  addProduct: async (req, res) => {
    try {
      const Product = new productdetails({
        productName: req.body.productname,
        Category: req.body.category,
        details: req.body.details,
        stock: req.body.stock,
        price: req.body.price,
      });
      Product.image = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
      await Product.save().then((result) => {
        if (result) {
          console.log(Product);

          res.redirect("/admin/products");
        } else {
          console.error();
        }
      });
    } catch (error) {
      res.render("500");
      console.error();
    }
  },

  getproducts: async (req, res) => {
    try {
      let products = await productdetails.find();
      res.render("admin/products", { products });
    } catch (error) {
      res.render("500");
      console.error();
    }
  },

  deleteProduct: (req, res) => {
    try {
      const id = req.params.id;
      const objId = mongoose.Types.ObjectId(id);
      productdetails.deleteOne({ _id: id }).then(() => {
        cart
          .updateMany(
            { "product.productId": objId },
            { $pull: { product: { productId: objId } } }
          )
          .then(() => {
            favorite
              .updateMany(
                { "product.productId": objId },
                { $pull: { product: { productId: objId } } }
              )
              .then(() => {
                res.redirect("/admin/products");
              });
          });
      });
    } catch (error) {
      res.render("500");
      console.error();
    }
  },

  editProduct: async (req, res) => {
    try {
      const id = req.params.id;

      const productData = await productdetails.findOne({ _id: id });
      category.find().then((category) => {
        if (productData && category) {
          res.render("admin/editProduct", { productData, category });
        } else {
          res.render("/admin/products");
        }
      });
    } catch (error) {
      res.render("500");
      console.error();
    }
  },

  doEditproduct: async (req, res) => {
    try {
      const id = req.params.id;

      const photos = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));

      const product = await productdetails.updateOne(
        { _id: id },
        {
          $set: {
            productName: req.body.productname,
            Category: req.body.category,
            details: req.body.details,
            stock: req.body.stock,
            price: req.body.price,
          },
        }
      );
      console.log(photos);
      if (photos.length) {
        const product = await productdetails
          .updateOne(
            { _id: id },
            {
              $set: { image: photos },
            }
          )
          .then(() => {
            res.redirect("/admin/products");
          });
      } else {
        res.redirect("/admin/products");
      }
    } catch (error) {
      res.render("500");
      console.error();
    }
  },

  category: (req, res) => {
    try {
      category.find().then((allCategory) => {
        if (allCategory) {
          res.render("admin/category", { allCategory });
        } else {
          console.log("not find");
        }
      });
    } catch (error) {
      res.render("500");

      console.log(error);
    }
  },

  addCategory: async (req, res) => {
    try {
      newCategory = req.body.category;
      let allCategory = await category.find();
      category.find({ Category: newCategory }).then((result) => {
        if (result.length) {
          res.render("admin/category", {
            err_msg: "Category already existed...!",
            allCategory,
          });
        } else {
          const newcategory = new category({
            Category: req.body.category,
          });
          newcategory.save().then((result) => {
            res.redirect("/admin/category");
          });
        }
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  deleteCategory: (req, res) => {
    try {
      const id = req.params.id;

      category.deleteOne({ _id: id }).then(() => {
        res.redirect("/admin/category");
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  editCategory: async (req, res) => {
    try {
      const id = req.params.id;
      newCategory = req.body.category;
      let allCategory = await category.find();
      let oldCat = await category.find({ _id: id });

      category.find({ Category: newCategory }).then((result) => {
        if (result.length) {
          res.render("admin/category", {
            err_msg: "Category already existed...!",
            allCategory,
          });
        } else {
          category
            .updateOne(
              { _id: id },
              {
                $set: {
                  Category: newCategory,
                },
              }
            )
            .then(() => {
              productdetails
                .updateMany(
                  { Category: oldCat[0].Category },
                  {
                    $set: {
                      Category: newCategory,
                    },
                  }
                )
                .then(() => {
                  res.redirect("/admin/category");
                });
            });
        }
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  getOrders: (req, res) => {
    try {
      order
        .aggregate([
          {
            $lookup: {
              from: "productdetails",
              localField: "orderItem.productId",
              foreignField: "_id",
              as: "productDetail",
            },
          },
        ])
        .then((orders) => {
          res.render("admin/orders", { orders });
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  changeStatus: (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;

      order
        .updateOne(
          { _id: id },
          {
            $set: {
              orderStatus: data.orderStatus,
              paymentStatus: data.paymentStatus,
            },
          }
        )
        .then(() => {
          res.redirect("/admin/orders");
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
  getCoupon: (req, res) => {
    try {
      coupon.find().then((coupons) => {
        console.log(coupons);
        res.render("admin/coupon", {
          coupons,
        });
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
  addCoupon: (req, res) => {
    try {
      const data = req.body;
      const dis = parseInt(data.discount);
      const max = parseInt(data.maxlimit);
      const discount = dis / 100;

      coupon
        .create({
          couponName: data.coupon,
          discount: discount,
          maxLimit: max,
          expiryDate: data.expirydate,
        })
        .then(() => {
          res.redirect("/admin/coupon");
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
  deleteCoupon: (req, res) => {
    try {
      let id = req.params.id;
      coupon.deleteOne({ _id: id }).then(() => {
        res.redirect("/admin/coupon");
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
  editCoupon: (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      coupon
        .updateOne(
          { _id: id },
          {
            couponName: data.coupon,
            discount: data.discount,
            maxLimit: data.maxlimit,
            expiryDate: data.expirydate,
          }
        )
        .then(() => {
          res.redirect("/admin/coupon");
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
  sales: (req, res) => {
    try {
      let date = 0;
      order.find({ orderStatus: "delivered" }).then((orderData) => {
        res.render("admin/sales", { orderData, date });
      });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  salesfilter: (req, res) => {
    try {
      let date = req.body;

      order
        .find({
          orderStatus: "delivered",
          createdAt: { $gte: date.from, $lte: date.to },
        })
        .then((orderData) => {
          if (orderData) {
            res.render("admin/sales", { orderData, date });
          } else {
            res.redirect("/sales");
          }
        });
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },

  downsales: async (req, res) => {
    try {
      let date = req.body;

      if (date.from) {
        let orderData = await order.find({
          orderStatus: "delivered",
          createdAt: { $gte: date.from, $lte: date.to },
        });

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = [
          { header: "OrderId", key: "OrderId", width: 30 },
          { header: "Customer", key: "Customer", width: 15 },
          { header: "Amount", key: "Amount", width: 15 },
          { header: "Status", key: "Status", width: 15 },
        ];

        orderData.forEach((orderData) => {
          worksheet.addRow({
            OrderId: orderData._id,
            Customer: orderData.address.fullname,
            Amount: orderData.totalAmount,
            Status: orderData.orderStatus,
          });
        });
        await workbook.xlsx.writeFile("order.xlsx").then((data) => {
          const location = path.join(__dirname + "../../../order.xlsx");
          res.download(location);
        });
      } else {
        let orderData = await order.find({ orderStatus: "delivered" });

        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        worksheet.columns = [
          { header: "OrderId", key: "OrderId", width: 30 },
          { header: "Customer", key: "Customer", width: 15 },
          { header: "Amount", key: "Amount", width: 15 },
          { header: "Status", key: "Status", width: 15 },
        ];

        orderData.forEach((order) => {
          worksheet.addRow({
            OrderId: order._id,
            Customer: order.address.fullname,
            Amount: order.totalAmount,
            Status: order.orderStatus,
          });
        });

        await workbook.xlsx.writeFile("order.xlsx").then((data) => {
          const location = path.join(__dirname + "../../../order.xlsx");
          res.download(location);
        });
      }
    } catch (error) {
      res.render("500");
      console.log(error);
    }
  },
};
