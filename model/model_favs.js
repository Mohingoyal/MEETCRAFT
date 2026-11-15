var mongoose=require("mongoose");

let colDesign={
    Citizenemail:{type:String,required:true,index:true,unique:true},
    vendoremails:[String]
}
var ver={
      versionKey:false,
}
let ScheemaClass=mongoose.Schema;
let Collectionobj=new ScheemaClass(colDesign,ver);
let favsColRef=mongoose.model("favs",Collectionobj)
module.exports=favsColRef;