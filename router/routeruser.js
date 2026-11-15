var express=require("express");
var routeruser=express.Router();
var {ValidateToken}=require("../config/jwtvalidation")
let{signup,findusers,login,checkauth,forgotpassword,verifyotp,resetpassword} =require('../controller/controlleruser')
routeruser.post("/signup",signup);
routeruser.post("/findusers",findusers)
routeruser.post("/login",login)
routeruser.post("/checkauth",ValidateToken,checkauth)
routeruser.post("/forgotpassword",forgotpassword)
routeruser.post("/verifyotp",verifyotp);
routeruser.post("/resetpassword",ValidateToken,resetpassword)
module.exports= routeruser;
