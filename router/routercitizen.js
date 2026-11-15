var express=require("express");
//for receiving exports of controller
var routercitizen=express.Router();//important for routing
//routing basically decide karta hai konsi call pe konsa function call hoga
var {ValidateToken}=require("../config/jwtvalidation")
let {save,dofetch,update,front_aadhar,back_aadhar,updatefavs,getfavs,removefavs}=require("../controller/contollerCitizen")
routercitizen.post("/save",save);
routercitizen.post("/update",update);
routercitizen.post("/fetch",dofetch);
routercitizen.post("/front_aadhar",front_aadhar)
routercitizen.post("/back_aadhar",back_aadhar)
routercitizen.post("/updatefavs",ValidateToken,updatefavs)
routercitizen.post("/getfavs",ValidateToken,getfavs)
routercitizen.post("/removefavs",ValidateToken,removefavs)
module.exports=routercitizen;