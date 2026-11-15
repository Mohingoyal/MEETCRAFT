var mongoose=require('mongoose');

let colDesign={
emailid:{type:String,required:true,index:true,unique:true},
password:String,
utype:String,
status:{type:Number,default:1},
resetOTPHash: String
}
var ver={
    versionKey:false,
}
let ScheemaClass=mongoose.Schema;
let CollectionObj=new ScheemaClass(colDesign,ver);
let UsersColRef=mongoose.model("users",CollectionObj);
module.exports= UsersColRef;