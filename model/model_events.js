var mongoose=require("mongoose");
let colDesign={
  event:{type:String,required:true,index:true,unique:true},
  services:String
}
var ver={
    versionKey:false,
}
let ScheemaClass=mongoose.Schema
let CollectionObj=new ScheemaClass(colDesign,ver);
let eventsColRef=mongoose.model("events",CollectionObj);
module.exports=eventsColRef;