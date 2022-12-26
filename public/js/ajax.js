


function addCart(productId) {
  $.ajax({
      url: "/addcart/" + productId,
      method : "get",
      success : (response)=>{
          if(response.status){
              let count = $('#cartCount').html()
              count=parseInt(count)+1
              $("#cartCount").html(count)

              Swal.fire({
                title: "Added to cart..!",
                icon: "success",
                confirmButtonText: "continue",
              }).then(function () {
                location.href= "/cart"

              });
            
              
          }
          if(response.productEx){
               
            Swal.fire({
              title: "Product Already in cart..!",
              icon: "warning",
              confirmButtonText: "continue",
            }).then(function () {
              location.reload();
            });
          }
      }
  })
  
}

function addFavorite(proId){
  
$.ajax({
  url : "/addFavorite/" + proId,
  method : "get",
  success : (res)=>{
    if(res.result){

      let count = $('#favCount').html()
      count = parseInt(count)+1
      $("#favCount").html(count)
      Swal.fire({
        title: "Added to wishlist..!",
        icon: "success",
        confirmButtonText: "continue",
      }).then(function () {
        location.href= "/favorite"

      });
    
  
  
   
    }else{
     
      Swal.fire({
        title: "Product Already in Wishlist..!",
        icon: "warning",
        confirmButtonText: "continue",
      }).then(function () {
        location.reload();
      });
    
        
      
  
    }
  }
})
}



function changeQuantity (cartId,proId,count){
 let quantity = parseInt(document.getElementById("quantity").innerHTML);
 $.ajax({
    url : '/changeQuantity',
    data : {
         cart : cartId,
         product : proId,
         count : count
    },
    method : 'post',
    success: (respose)=>{
     document.getElementById("quantity").innerHTML = quantity + count;
 location.reload();
    }
 })
}



function removeProduct(cartId, productId) {
  $.ajax({
    url: "/removeProduct",
    data: {
      cart: cartId,
      product: productId,
    },
    method: "post",
    success: () => {
      location.reload();
    },
  });
}

function removeFavorite(favId,productId) {
  $.ajax({
    url: "/removeFavorite",
    data: {
      fav: favId,
      product: productId,
    },
    method: "post",
    success: () => {
      location.reload();
    },
  });
}



// $('#adcard').on('click',function (){
//   $(this).toggleClass('selected');
// });


// razorPay


function razorPay(order) {

  var options = {
    key: "rzp_test_G8YiccXSwWFOD5", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Castle ice creams",
    description: "Test Transaction",
    image: "/public/img/icon.png",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
      verifyPayment(response, order);
    },
   
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#272A30",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
    // paymentFail(response);
    location.href="/paymentFail";
  });
  rzp1.open();
}

function verifyPayment(payment, order) {
  
  $.ajax({
    url: "/verifyPayment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.success) {
        location.href = "/orderSuccess";
      } else {
        location.href = "/paymentFail";
      }
    },
  });
}
