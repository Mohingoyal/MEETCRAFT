let UsersColRef =require( "../model/model_users");
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const crypto = require("crypto");
// 1. Destructure the modern BrevoClient class directly from the package
const { BrevoClient } = require('@getbrevo/brevo'); 

// 2. Initialize it instantly using your API key
const apiInstance = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
async function resetpassword(req, resp) {
    try {
        // Find the user using the email in JWT payload
        let response = await UsersColRef.findOne({
            emailid: req.body.emailid
        });

        if (response == null ) {
            return resp.json({
                status: false,
                msg: "Reset request is invalid."
            });
        }

        // // Verify that this reset token is still authorized
        // let match = await bcrypt.compare(
        //     token,
        //     response.resetTokenHash
        // );

        // if (!match) {
        //     return resp.json({
        //         status: false,
        //         msg: "Invalid reset token."
        //     });
        // }

        let newPassword = req.body.password;

        if (!newPassword || newPassword.length < 8) {
            return resp.json({
                status: false,
                msg: "Password must contain at least 8 characters."
            });
        }

        // Hash the new password
        let hashedPassword = await bcrypt.hash(newPassword, 10);

        response.password = hashedPassword;

        // Invalidate reset authorization
        // response.resetTokenHash = undefined;
        // response.resetOTPHash = undefined;

        await response.save();

        return resp.json({
            status: true,
            msg: "Password reset successfully."
        });

    }
    catch (err) {
        console.log("Reset password error:", err);

        return resp.status(500).json({
            status: false,
            msg: "Something went wrong."
        });
    }
}
async function verifyotp(req, resp) {
    try {
        let response = await UsersColRef.findOne({
            emailid: req.body.emailid
        });
//banda dhondo hai bhi ya nhi
        if (response == null || !response.resetOTPHash) {
            return resp.json({
                status: false,
                msg: "Invalid OTP request."
            });
        }

        let match = await bcrypt.compare(
            req.body.otp,
            response.resetOTPHash
        );
let resettoken=jwt.sign({emailid:req.body.emailid},process.env.SEC_KEY,{expiresIn:"5m"})

        if (match) {
            return resp.json({
                status: true,
                msg: "OTP verified successfully.",
                resettoken:resettoken
            });
        }
        else {
            return resp.json({
                status: false,
                msg: "Incorrect OTP."
            });
        }
    }
    catch (err) {
        console.log(err);
        return resp.status(500).json({
            status: false,
            msg: "Something went wrong."
        });
    }
}
async function forgotpassword(req, resp) {
    try {
        let response = await UsersColRef.findOne({
            emailid: req.body.emailid
        });

        // Don't reveal whether an email is registered.
        if (response == null || response.status !== 1) {
            return resp.json({
                status: true,
                msg: "If the account exists, an OTP has been sent."
            });
        }

        // Generate a 6-digit OTP
        let otp = crypto.randomInt(100000, 1000000).toString()//will simply choose a random number from the given range
//ek random value le li range mein se 
        // Hash the OTP before storing it
        let hashedOTP = await bcrypt.hash(otp, 10);//10 baar hashing hogi

        response.resetOTPHash = hashedOTP;
//response now has the referenc eof row from collection with given email

        await response.save();
//we will add time part later
        // Send OTP through Brevo
        await apiInstance.transactionalEmails.sendTransacEmail({
            subject: "MeetCraft | Password Reset OTP",

            htmlContent: `
                <div style="font-family:Arial; padding:25px; background:#F5F8F3;">
                    <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px;">
                        <h2 style="color:#185744;">MeetCraft</h2>

                        <h3>Password Reset Request</h3>

                        <p>We received a request to reset your password.</p>

                        <p>Your OTP is:</p>

                        <h1 style="color:#185744; letter-spacing:5px;">
                            ${otp}
                        </h1>

                 
<p> This session is valid for only 5 minutes.</p>
                        <p>If you did not request this, please ignore this email.</p>
                    </div>
                </div>
            `,

            sender: {
                name: "MeetCraft",
                email: "goyalmohin54@gmail.com"
            },

            to: [{
                email: req.body.emailid,
                name: req.body.emailid
            }]
        });

        return resp.json({
            status: true,
            msg: "If the account exists, an OTP has been sent."
        });

    }
    catch (err) {
        console.log("Forgot password error:", err);

        return resp.status(500).json({
            status: false,
            msg: "Unable to process your request."
        });
    }
}
//==================================
async function checkauth(req,resp)
{//agar yahan tak control pahunch gaya toh iska matlab validate token is neither expired nor fake, ab yahaan ope kuch check nhi karna sirf positoive status return karna hai
    return resp.json({
        status: true,
        emailid: req.user.emailid,
        utype: req.user.utype
    });
}
async function login(req,resp){
 let response=await UsersColRef.findOne({emailid:req.body.emailid})
if(response==null)
    { resp.json({found:0})}
else   if (response.status !== 1) {
            return resp.json({ found: 3, msg: "Account inactive" });
        }

else if(response!=null)
{//data toh exist karta hai pehle iski jwt token toh bana le, usi ko toh server vapas bhejego

    let match=await bcrypt.compare(req.body.password,response.password)
if(match)
{    let token=jwt.sign({emailid:req.body.emailid,utype: response.utype},process.env.SEC_KEY,{expiresIn:"20m"})
    console.log("******"+token)
    return resp.json({found:1,token:token,msg:response})
}
else {
    return resp.json({found:2})
}
}
}


async function findusers(req,resp)
{
    
UsersColRef.findOne({emailid:req.body.emailid}).then((result)=>{
if(result!=null)
    resp.json({found:1,msg:result})
else resp.json({found:0,msg:result})
}).catch((err)=>resp.json({found:-1,msg:err}))
}


async function signup(req,resp)
{
    const saltrounds=10;
    req.body.password=await bcrypt.hash(req.body.password,saltrounds)
    let doc=new UsersColRef(req.body)
    doc.save().then(async(result)=>{
    //        await apiInstance.transactionalEmails.sendTransacEmail({
    //   subject: "Welcome to My App! 🎉",
    //   htmlContent: `<h1>Hello, ${req.body.emailid}!</h1><p>Your MERN stack profile is active and secure.</p>`,
      
    //   // CRUCIAL SAFETY RULE: This MUST be your verified college email address
    //   sender: { name: "Meet Craft", email: "goyalmohin54@gmail.com" }, 
      
    //   // The destination user email address typed into the form
    //   to: [{ email: req.body.emailid, name: req.body.emailid }]
    // })
    await apiInstance.transactionalEmails.sendTransacEmail({
  subject: "Welcome to MeetCraft | Let's Make Moments Memorable",

  htmlContent: `
    <div style="margin:0; padding:40px 15px; background-color:#F5F8F3; font-family:Arial,sans-serif;">

      <div style="max-width:600px; margin:auto; background-color:#FFFFFF; border-radius:12px; overflow:hidden; border:1px solid #DCE4DC;">

        <!-- Header -->
        <div style="background-color:#185744; padding:28px; text-align:center;">
          <h1 style="color:#FFFFFF; margin:0; font-size:28px; letter-spacing:1px;">
            MeetCraft
          </h1>
          <p style="color:#EAF1EA; margin:8px 0 0; font-size:13px;">
            Make Every Moment Special
          </p>
        </div>

        <!-- Email Body -->
        <div style="padding:35px 30px; color:#31483E;">

          <h2 style="font-size:23px; margin-top:0; color:#185744;">
            Welcome aboard!
          </h2>

          <p style="font-size:15px; line-height:1.7;">
            Hello <strong>${req.body.emailid}</strong>,
          </p>

          <p style="font-size:15px; line-height:1.7;">
            We're delighted to welcome you to <strong>MeetCraft</strong>!
            Your account has been successfully created, and you're now
            part of a community that brings people, event planners,
            and trusted vendors together.
          </p>

          <p style="font-size:15px; line-height:1.7;">
            Whether you're planning a special celebration or offering
            services to make someone's event unforgettable, MeetCraft
            is here to make the journey simpler.
          </p>

          <div style="background-color:#EAF1EA; padding:18px; border-radius:8px; margin:25px 0;">
            <p style="margin:0; font-size:14px; color:#185744;">
              <strong>Your registered email:</strong><br/>
              ${req.body.emailid}
            </p>
          </div>

          <p style="font-size:15px; line-height:1.7;">
            Thank you for choosing MeetCraft. We look forward to
            being a part of your memorable moments!
          </p>

          <p style="font-size:15px; line-height:1.7; margin-bottom:0;">
            Warm regards,<br/>
            <strong style="color:#185744;">Team MeetCraft</strong>
          </p>

        </div>

        <!-- Footer -->
        <div style="background-color:#F5F8F3; padding:18px; text-align:center; border-top:1px solid #DCE4DC;">
          <p style="font-size:12px; color:#78837A; margin:0;">
            © ${new Date().getFullYear()} MeetCraft. All rights reserved.
          </p>
          <p style="font-size:12px; color:#78837A; margin:8px 0 0;">
            Making celebrations easier, one event at a time.
          </p>
        </div>

      </div>
    </div>
  `,

  sender: {
    name: "MeetCraft",
    email: "goyalmohin54@gmail.com"
  },

  to: [
    {
      email: req.body.emailid,
      name: req.body.emailid
    }
  ]
})
    .then((result)=>console.log("mail sent")).catch((err)=>console.log("error"));
        resp.json({status:true,msg:result})
        
    }).catch((err)=>resp.json({status:false,msg:err}))
    
}
module.exports={
    findusers,
    signup,
    login,
    checkauth,
    forgotpassword,
    verifyotp,
    resetpassword
}