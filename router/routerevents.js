var express=require("express");
let routerevents=express.Router();
let {ValidateToken}=require("../config/jwtvalidation")
let {cities,addservices,getservices,geteventsandtheirservices,updateservices}=require("../controller/controllerevents");
routerevents.post("/cities",cities);
routerevents.post("/addservices",addservices);
routerevents.post("/getservices",getservices);
routerevents.post("/geteventsandtheirservices",ValidateToken,geteventsandtheirservices);
routerevents.post("/updateservices",updateservices)
module.exports=routerevents;