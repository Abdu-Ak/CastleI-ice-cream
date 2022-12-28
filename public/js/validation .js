
function validatingForm(form){
    userName =document.getElementById("username");
    phoneNumber =document.getElementById("phonenumber");
    email =document.getElementById("email");
    password =document.getElementById("password");

    


    if(userName.value == ""){
        document.getElementById('userNameError').innerHTML="please enter your  user name..! "
        userName.focus();
        return false;
    }
     var regexname = /^[a-zA-Z\-]+$/ ;
    
     if(regexname.test(userName.value)=== false){
      document.getElementById('userNameError').innerHTML="User name should not contain  special characters..! "
      userName.focus();
      return false;
     }
    





     if(phoneNumber.value == ""){
        document.getElementById('phoneNumberError').innerHTML="please enter your phone number..! "
        phoneNumber.focus();
        return false;

    }

    var regexphone =  /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
     if(regexphone.test(phoneNumber.value)=== false){
      document.getElementById('phoneNumberError').innerHTML="mobile number should be 10 digits..! "
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

   var regexpass =  /(?=(.*?[a-zA-Z|0-9]){4})/;
   if(regexpass.test(password.value)=== false){
    document.getElementById('passwordError').innerHTML="password should have atleast 4 digits..! "
    password.focus();
    return false;
   }

    if(password.value == ""){
        document.getElementById('passwordError').innerHTML="please enter your password..! "
        password.focus();
        return false;
    }
    return true;

}
 
    
  
  
  
       