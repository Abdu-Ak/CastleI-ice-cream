const { response } = require("../../app");
const { $where } = require("../../model/signUp");

function validatingForm(form){
    userName =document.getElementById("username");
    phoneNumber =document.getElementById("password");
    email =document.getElementById("email");
    password =document.getElementById("password");

    


    if(userName.value == ""){
        document.getElementById('userNameError').innerHTML="please enter your  user name..! "
        userName.focus();
        return false;
    }
   
    





     if(phoneNumber.value == ""){
        document.getElementById('phoneNumberError').innerHTML="please enter your phone number..! "
        phoneNumber.focus();
        return false;
    }
     if(email.value == ""){
        document.getElementById('emailError').innerHTML="please enter your mail id..! "
        email.focus();
        return false;
    }
      const re =
       /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
     if(!re.test(email.value)){
        document.getElementById('emailError').innerHTML="please enter valid email..! "
        email.focus();
        return false;
    }
    if(password.value == ""){
        document.getElementById('passwordError').innerHTML="please enter your password..! "
        password.focus();
        return false;
    }
    return true;

}
 function addCart(productId) {
    $.ajax({
        url: "/addcart/" + productId,
        method : "get",
        success : (response)=>{
            if(response.status){
                let count = $('#cartCount').html()
                count=parseInt(count)+1
                $("#cartCount").html(count)
                
            }
        }
    })
    
 }
  
 function addFavorite(proId, btn){
  $.ajax({
    url : "/addFavorite/" + proId,
    method : "get",
    success : (res)=>{
      if(res.result){
  
        let count = $('#favCount').html()
        count = parseInt(count)+1
        $("#favCount").html(count)
      
      
      }else{
        let count = $('#favCount').html()
        count=parseInt(count)-1
        $("#favCount").html(count)
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
 
    
  
  
  
       