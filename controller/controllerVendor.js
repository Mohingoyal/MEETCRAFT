
var path = require("path");
var { getCloudinaryObject } = require("../config/configCloud.js");
const VendorColRef = require("../model/model_vendors");
var cloudinary = getCloudinaryObject();
//====================
function dofetch(req, resp) {
    VendorColRef.findOne({ emailid: req.body.emailid }).then((result) => {
        console.log(result)
        if (result != null)
            resp.json({ status: true, "msg": result })
        else resp.json({ status: true })
    }
    ).catch((err) => {
        resp.json({ status: false, "msg": err.message })
    })
}
async function rate(req,resp)
{
    await VendorColRef.findOneAndUpdate({emailid:req.body.emailid},
        {
            $inc:{
                sumstar:req.body.stars,count:1
            }
        }
    ).then((result)=>{
       resp.json({status:true,msg:result})
    }).catch((err)=>{
        resp.json({status:false,msg:err.message})
    })
    
}
//=====================
async function save(req, resp) {
    let myUrl = "nopic.jpg";
    if (req.files != null) {
        let fileName = req.files.shoppic.name;
        // let fullPath=__dirname+"/uploads/"+fileName;
        let fullPath = path.join(__dirname, "..", "uploads", fileName)
        console.log(fullPath);

        await req.files.shoppic.mv(fullPath);
        console.log("Uploaded Successfully");

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            myUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl);
        });
    }

    req.body.shoppicurl = myUrl;  //new Propert added at runtime
    let myUrl2 = "nopic.jpg";
    if (req.files != null) {
        let fileName = req.files.certpic.name;
        // let fullPath=__dirname+"/uploads/"+fileName;
        let fullPath = path.join(__dirname, "..", "uploads", fileName)
        console.log(fullPath);

        await req.files.certpic.mv(fullPath);
        console.log("Uploaded Successfully");

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            myUrl2 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl2);
        });
        req.body.certpicurl = myUrl2;
    }

    let doc = new VendorColRef(req.body);

    doc.save().then((res) => {
        //resp.send(res)
        console.log(res);
        resp.json({ status: true, msg: res })

    }).catch((err) => {//resp.send(err.message)
        console.log(err);
        resp.json({ status: false, msg: err })
    });


}
//===========


async function update(req, resp) {
    await req.body;
    console.log("***************************")
    console.log(JSON.stringify(req.body))
    console.log("***************************")

    if (req.files == null)//no need to update the picture
    {
        VendorColRef.findOneAndUpdate({ emailid: req.body.emailid }, {
            $set: {
                emailid: req.body.emailid, name: req.body.name, contact: req.body.contact, businessName: req.body.businessName, area: req.body.area, address: req.body.address, city: req.body.city, estd: req.body.estd, website: req.body.website, insta: req.body.instagram, shoppicurl: req.body.shopicurl, certpicurl: req.body.certpicurl

            }
        }).then((result) => {
            if (result != null) {
                resp.json({ status: true, msg: result })
                console.log("hi")
            }

        }).catch((err) => {
            resp.json({ status: false, msg: err })
        })
    }
    else if (req.files.shoppic == null && req.files.certpic != null) {

        let myUrl = "nopic.jpg";
        if (req.files.certpic != null) {
            let fileName = req.files.certpic.name;
            // let fullPath=__dirname+"/uploads/"+fileName;
            let fullPath = path.join(__dirname, "..", "uploads", fileName)
            console.log(fullPath);

            await req.files.certpic.mv(fullPath);
            console.log("Uploaded Successfully");

            await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
                myUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
                console.log("************")
                console.log(myUrl);
            });
        }

        req.body.certpicurl = myUrl;
        VendorColRef.findOneAndUpdate({ emailid: req.body.emailid }, {
            $set: {
                emailid: req.body.emailid, name: req.body.name, contact: req.body.contact, businessName: req.body.businessName, area: req.body.area, address: req.body.address, city: req.body.city, estd: req.body.estd, website: req.body.website, insta: req.body.instagram, shoppicurl: req.body.shopicurl, certpicurl: req.body.certpicurl

            }
        }).then((result) => {
            if (result != null) {
                resp.json({ status: true, msg: result })
                console.log("hi")
            }

        }).catch((err) => {
            resp.json({ status: false, msg: err })
        })
    }
    //==========================
    else if (req.files.shoppic != null && req.files.certpic == null) {

        let myUrl = "nopic.jpg";
        if (req.files.shoppic != null) {
            let fileName = req.files.shoppic.name;
            // let fullPath=__dirname+"/uploads/"+fileName;
            let fullPath = path.join(__dirname, "..", "uploads", fileName)
            console.log(fullPath);

            await req.files.shoppic.mv(fullPath);
            console.log("Uploaded Successfully");

            await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
                myUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
                console.log("************")
                console.log(myUrl);
            });
        }

        req.body.shoppicurl = myUrl;
        VendorColRef.findOneAndUpdate({ emailid: req.body.emailid }, { $set: { emailid: req.body.emailid, name: req.body.name, contact: req.body.contact, businessName: req.body.businessName, area: req.body.area, address: req.body.address, city: req.body.city, estd: req.body.estd, website: req.body.website, insta: req.body.instagram, shoppicurl: req.body.shopicurl, certpicurl: req.body.certpicurl } }).then((result) => {
            if (result != null) {
                resp.json({ status: true, msg: result })
                console.log("hi")
            }

        }).catch((err) => {
            resp.json({ status: false, msg: err })
        })
    }
    //=====================================================
    else if (req.files.shoppic != null && req.files.certpic != null) {
        let myUrl = "nopic.jpg";
        if (req.files != null) {
            let fileName = req.files.shoppic.name;
            // let fullPath=__dirname+"/uploads/"+fileName;
            let fullPath = path.join(__dirname, "..", "uploads", fileName)
            console.log(fullPath);

            await req.files.shoppic.mv(fullPath);
            console.log("Uploaded Successfully");

            await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
                myUrl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
                console.log("************")
                console.log(myUrl);
            });
        }

        req.body.shoppicurl = myUrl;  //new Propert added at runtime
        let myUrl2 = "nopic.jpg";
        if (req.files != null) {
            let fileName = req.files.certpic.name;
            // let fullPath=__dirname+"/uploads/"+fileName;
            let fullPath = path.join(__dirname, "..", "uploads", fileName)
            console.log(fullPath);

            await req.files.certpic.mv(fullPath);
            console.log("Uploaded Successfully");

            await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
                myUrl2 = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
                console.log("************")
                console.log(myUrl2);
            });
            req.body.certpicurl = myUrl2;
        }
        VendorColRef.findOneAndUpdate({ emailid: req.body.emailid }, { $set: { emailid: req.body.emailid, name: req.body.name, contact: req.body.contact, businessName: req.body.businessName, area: req.body.area, address: req.body.address, city: req.body.city, estd: req.body.estd, website: req.body.website, insta: req.body.instagram, shoppicurl: req.body.shopicurl, certpicurl: req.body.certpicurl } }).then((result) => {
            if (result != null) {
                resp.json({ status: true, msg: result })
                console.log("hi")
            }

        }).catch((err) => {
            resp.json({ status: false, msg: err })
        })
    }
}
//=========


async function dataupdate(req, resp) {
    console.log("JIUTYTT")
    VendorColRef.findOne({ emailid: req.body.emailid }).then((result) => {
        // console.log(JSON.stringify(result))
        resp.json({ status: true, msg: result })

    }).catch((err) => {
        resp.json({ status: false, msg: err })
    })
    // console.log("bye")

}
//=============
async function getvendorsforevent(req, resp) {
    console.log("enetred the controller")
    console.log(req.body.city)
    let vendorsforevent = await VendorColRef.find({ city: req.body.city })//vendors for event
    console.log(vendorsforevent)
     console.log(req.body.service[0])
    let vendors =  vendorsforevent.filter((item) => {
        let serviceofitem = item.selcate.split(",");
        if (serviceofitem.includes(req.body.service[0])) { return item; }
    }

    )
    console.log(vendors)
    resp.json(vendors);
}
async function findvendors(req, resp) {
    let response = await VendorColRef.findOne({ emailid: req.body.emailid })
    console.log(response)
    resp.json(response)
}
module.exports = { save, dofetch, dataupdate, update, getvendorsforevent, findvendors ,rate}