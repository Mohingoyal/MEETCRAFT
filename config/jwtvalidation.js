var jwt=require("jsonwebtoken");//jwt aagaya
//middleware function
function ValidateToken(req,resp,next)//next is to move on next step
{
let fulltoken=req.headers['authorization'];//authorization mein store tha 

let ary=fulltoken.split(" ");//space ke base pe separation, bearer se
  if (!fulltoken || !fulltoken.startsWith("Bearer ")) {
        return resp.status(401).json({
            status: false,
            msg: "Token not provided"
        });
    }


try{
    let TokenValidObj=jwt.verify(ary[1],process.env.SEC_KEY);//if the provided token is not valid then it will throw an error
    if(TokenValidObj!=null)
    {
        const payload=jwt.decode(ary[1]);
        //this is for getting the complete payload from the token in case sarurat padi toh istemaal karenge
        console.log("*****"+JSON.stringify(payload)+"********")
                 req.user = TokenValidObj;

            next();
        
    }
    else return resp.json({status:false,tokenstatus:false,msg:"**Invalid token"})
}
catch(err)
{
    resp.json({status:false,msg:err.message});
    return;
}
}
module.exports={ValidateToken}