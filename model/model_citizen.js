var mongoose=require("mongoose");
let colDesign={
    emailid:{type:String,required:true,index:true,unique:true},
    name:String,
    contact:String,
    acardno:String,
    gender:String,
    address:String,
    city:String,
    dob:{type:Date,default:Date.now}
  
}
var ver={
    versionKey:false,
}
let ScheemaClass=mongoose.Schema
let CollectionObj=new ScheemaClass(colDesign,ver);
let CitizenColRef=mongoose.model("citizen",CollectionObj);
module.exports=CitizenColRef;