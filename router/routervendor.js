var express=require("express");
//for receiving exports of controller
var routervendor=express.Router();//important for routing
//routing basically decide karta hai konsi call pe konsa function call hoga
let {ValidateToken}=require("../config/jwtvalidation")
let {save,dofetch,dataupdate,update,getvendorsforevent,findvendors,rate}=require("../controller/controllerVendor.js")
routervendor.post("/save",save);
routervendor.post("/update",update);
routervendor.post("/fetch",dofetch);
routervendor.post("/getdataupdate",dataupdate);
routervendor.post("/getvendorsforevent",ValidateToken,getvendorsforevent);
routervendor.post("/findvendors",findvendors)
routervendor.post("/rate",ValidateToken,rate)
module.exports=routervendor;