var mongoose=require("mongoose");
let url=process.env.ATLAS_URL;
function domongooseconnection(){
mongoose.connect(url).then((

)=>console.log("connected to mongooooseee")).catch((err)=>console.log((err.message)))}
module.exports={domongooseconnection};