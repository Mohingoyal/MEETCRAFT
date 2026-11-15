var express = require("express");
let app = express();
var cors = require("cors");
app.use(express.json());//converts
app.use(cors(
    {
        origin:"https://meetcraftvite.vercel.app",credentials:true
    }
));

//=============
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);//PAD GAYI ZARURt
require('dotenv').config();//iska bina error aa jayega, kyuki process.env hi nhi chalega
var  {domongooseconnection} = require("./config/mongooseconnection.js");//function import karwa liya

domongooseconnection();

//=============
//this line is very important without this the database won t pick the data
app.use(express.urlencoded(true)); //convert POST data to JSON object//excellent point

var fileuploader = require("express-fileupload");
app.use(fileuploader());


var vendorRouter=require("./router/routervendor.js")
var citizenRouter=require("./router/routercitizen.js")
var eventsRouter=require("./router/routerevents.js")
var usersRouter=require("./router/routeruser.js")
app.use("/vendor", vendorRouter);
app.use("/citizen",citizenRouter);
app.use("/events",eventsRouter);
app.use("/users",usersRouter)
app.listen(2001, function (req, resp) {
    console.log("server started !!!!!!")
})//ye setup kar liya server