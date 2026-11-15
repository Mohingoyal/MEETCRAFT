
var path = require("path");
var { getCloudinaryObject } = require("../config/configCloud.js");
const CitizenColRef = require("../model/model_citizen.js");
var cloudinary = getCloudinaryObject();
var genAI = require("../config/genai.js")
var favsColRef=require("../model/model_favs.js")
//====================
async function updatefavs(req,resp)
{console.log("hi")
    let responsefind=await favsColRef.find({Citizenemail:req.body.email})//this will return an array
    let response;
    if(responsefind.length==0)
   { response= await favsColRef.insertOne({Citizenemail:req.body.email,vendoremails:req.body.favourites})}//one time insert ke baad no addition possible}
    else{
response=await favsColRef.findOneAndUpdate({Citizenemail:req.body.email},{
    $set:{
        vendoremails:req.body.favourites
    }
})
    }
    console.log(response)
    resp.json(response)
}
async function removefavs(req,resp)
{
    let response=await favsColRef.findOneAndUpdate({Citizenemail:req.body.email},
        {$set:{vendoremails:req.body.vendorsemail

          } 
       },  {new:true}//for returning the newly updated object
    )
    console.log("the updated favs are and object detains are ::"+response);
    resp.json(response)
}
async function getfavs(req,resp)
{console.log("hi")
    console.log(req.body.email)
   let response= await favsColRef.findOne({Citizenemail:req.body.email})
    resp.json(response)
    console.log(response)
}
//===================
function dofetch(req, resp) {
    CitizenColRef.findOne({ emailid: req.body.emailid }).then((result) => {
        console.log(result)
        if (result != null)
            resp.json({ status: true, "msg": result })
        else resp.json({ status: false })
    }
    ).catch((err) => {
        resp.json({ status: false, "msg": err.message })
    })
}
//=====================

//=============================


async function save(req, resp) {
    let doc = new CitizenColRef(req.body);

    doc.save().then((res) => {
        console.log(res);
        resp.json({ status: true, msg: res })

    }).catch((err) => {//resp.send(err.message)
        console.log(err);
        resp.json({ status: false, msg: err })
    });


}
//===========
async function ai_fetchdata_aadhar(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in aadhar card and give output STRICTLY in JSON format {acardno:'',name:'',gender:'',dob:''} and fetch the date in the format YYYY-MM-DD.Dont give output as string."
    const imageResp = await fetch(imgurl)//imgurl mein url aayega image ka
        .then((response) => response.arrayBuffer());//to convert file into binary
    const result = await genAI.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData
}
async function front_aadhar(req, resp) {

    let jsonResultFromAi;
    let msg = "File not Uploaded";
    let myUrlfront = "nopic.jpg";
    if (req.files != null && req.files.frontSide != null) {
        let fileName = req.files.frontSide.name;
        // let fullPath=__dirname+"/uploads/"+fileName;
        let fullPath = path.join(__dirname, "..", "uploads", fileName)
        await req.files.frontSide.mv(fullPath);//moving obtained file to folder
        msg = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPath).then(async function (picUrlResult) {
            myUrlfront = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrlfront);
            jsonResultFromAi = await ai_fetchdata_aadhar(myUrlfront);
            console.log(jsonResultFromAi);
            //resp.send(jsonResultFromAi);

        });

    }
    resp.json(jsonResultFromAi);
}
//===================
async function ai_fetchdata_aadharrear(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in aadhar card and give output STRICTLY in JSON format {address:'',city:''}.Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());
    const result = await genAI.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData
}
async function back_aadhar(req, resp) {

    let jsonResultFromAirear;
    let msg = "File not Uploaded";
    let myUrlback = "nopic.jpg";
    if (req.files.BackSide != null) {
        let fileName = req.files.BackSide.name;
        // let fullPath=__dirname+"/uploads/"+fileName;
        let fullPath = path.join(__dirname, "..", "uploads", fileName)
        await req.files.BackSide.mv(fullPath);//moving obtained file to folder
        msg = "Uploaded Successfully";

        await cloudinary.uploader.upload(fullPath).then(async function (picUrlResult) {
            myUrlback = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrlback);
            jsonResultFromAirear = await ai_fetchdata_aadharrear(myUrlback);
            console.log(jsonResultFromAirear);
            //resp.send(jsonResultFromAi);

        });

    }
    resp.json(jsonResultFromAirear);
}
///============================================
async function update(req, resp) {



    if (req.body.contact == "")//no need to update the picture
    {
        ///======================================================
        CitizenColRef.findOneAndUpdate({ emailid: req.body.emailid }, {
            $set: {
                name: req.body.name, acardno: req.body.acardno, dob: req.body.dob, city: req.body.city, address: req.body.address, gender: req.body.gender
            }
        }).then((result) => {
            if (result != null) {
                resp.json({ status: true, msg: result })
                console.log("hi")
            }
            else{
                resp.json({status:false,msg:null})
            }

        }).catch((err) => {
            resp.json({ status: false, msg: err })
        })
    }
    else {
        ///======================================================
        CitizenColRef.findOneAndUpdate({ emailid: req.body.emailid }, {
            $set: {
                name: req.body.name, acardno: req.body.acardno, contact: req.body.contact, dob: req.body.dob, city: req.body.city, address: req.body.address, gender: req.body.gender
            }
        }).then((result) => {
            if (result != null) {
                resp.json({ status: true, msg: result })
                console.log("hi")
            }
 else{
                resp.json({status:false,msg:null})
            }
        }).catch((err) => {
            resp.json({ status: false, msg: err })
        })
    }
}
// //=========



module.exports = {
    save, dofetch,
    front_aadhar,
    back_aadhar,
    update,
    getfavs,
    updatefavs,removefavs
}