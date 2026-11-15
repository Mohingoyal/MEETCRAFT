var mongoose=require("mongoose");
let colDesign={
    emailid:{type:String,required:true,index:true,unique:true},
    name:String,
    contact:String,
    business:String,
    area:String,
    address:String,
    city:String,
    estd:{type:Date,default:Date.now},
    selcate:String,
    website:String,
    insta:String,
    shoppicurl:String,
    certpicurl:String,
    sumstar:{type:Number,default:0},
    count:{type:Number,default:0}
}
var ver={
    versionKey:false,
}
let ScheemaClass=mongoose.Schema
let CollectionObj=new ScheemaClass(colDesign,ver);
let VendorColRef=mongoose.model("vendors",CollectionObj);
module.exports=VendorColRef;