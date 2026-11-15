let VendorColRef=require("../model/model_vendors");
let eventsColRef=require("../model/model_events");
const { response } = require("express");
async function cities(req,resp)
{
   let response= await VendorColRef.distinct("city");
   console.log(response);
   resp.json(response)
   

} 

async function addservices(req,resp)
{
let doc=new eventsColRef(req.body);
doc.save().then((res)=>{
    console.log(res)
    
}
).catch((err)=>{
    console.log(err)
})
}
 async function geteventsandtheirservices(req,resp)
{
let response=await eventsColRef.find();//ye mene ek event service ke liye alag se collection bana rakhi hai 
console.log(response)
resp.json(response)
}
 function getservices(req,resp)
{
eventsColRef.find({event:req.body.event}).then((result)=>{
    resp.json(result);
    console.log(result);
}).catch((err)=>{
    resp.json(err)
})
}
async function updateservices(req,resp)
{
  let response= await eventsColRef.updateMany(
  {event:req.body.event},
  [{ $set: { services: { $concat: [ "$services",",",req.body.services ] } } }],
  { updatePipeline: true }//important iske bina hame permission nhi milegi upadte karne ki
)
    resp.json(response)
}
module.exports={
    cities,
    addservices,
    getservices,
   geteventsandtheirservices,
   updateservices
}