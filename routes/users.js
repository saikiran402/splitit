var express = require('express');
var router = express.Router();
const db = require('../models');
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
var async = require("async");
var crypto = require("crypto");
const bcrypt = require('bcrypt');

const AesEncryption = require('aes-encryption');


const aes = new AesEncryption()
aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')
// Note: secretKey must be 64 length of only valid HEX characters, 0-9, A, B, C, D, E and F



async function encrypt(data){
  const encryptedData = aes.encrypt(data)
  return encryptedData;
}

async function decrypt(data){
  const decryptData = aes.decrypt(data)
  return decryptData;
}

/* GET users listing. */
router.post('/signup', async function (req, res, next) {
  // res.send('respond with a resource');
  console.log(req.body)
  req.body = decrypt(req.body)

if (req.body.password != req.body.confirm_password) {
  var respMes = encrypt('Passwords do not match');
  return res.status(409).json({ statusCode: 409, encText: respMes })
}
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        req.body.password = hash;
    });
});
 
  if (req.body.phone.length != 10) {
    var respMes = encrypt('Mobile No should be 10 characters');
    return res.status(409).json({ statusCode: 409, encText: respMes })
  }

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email) == false) {
    var respMes = encrypt('Invalid email');
    return res.status(409).json({ statusCode: 409, encText: respMes })
  }

  await db.User.create(req.body).then((err, user) => {
    var respMes = encrypt('Account Created');
    return res.status(200).json({ statusCode: 200, encText: respMes })
  }).catch((err) => {
    console.log(err)
    if (err.code === 11000) {
      var respMes = encrypt('User with the given number already exists');
      return res.status(409).json({ statusCode: 409, encText: respMes })
    }
    console.log("Error", err)
    var respMes = encrypt('Error, try again later');
    res.status(409).json({ statusCode: 409, encText: respMes  })
  })
});


// router.get('/enc',async function(req,res){
//   const encrypted = aes.encrypt("{name:'saikiran',passowrd:'hello'}")
//   console.log(encrypted)
// const decrypted = aes.decrypt(encrypted)
// console.log(decrypted)

// })

// Login
router.post('/login', async function (req, res, next) {
  req.body = decrypt(req.body)
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email) == false) {
    var respMes = encrypt('Invalid Email');
    return res.status(409).json({ statusCode: 409, encText: respMes })
  }
  if (req.body.password.length == 0) {
    var respMes = encrypt('Invalid password');
    return res.status(409).json({ statusCode: 409,  encText: respMes })
  }
  var data = await db.User.findOne({ email: req.body.email });
  if (data) {
    await bcrypt.compare(req.body.password, data.password, function(err, result) {
      // result == true
      if(result){
        var id = data._id;
        let token = jwt.sign(
          { id },
          'orangedooraptisthebestaptinstillwater',
        );
        data.token = token;
        data.registrationToken = req.body.registrationToken;
        data.save();
        var da = {
          message: 'SUCCESS', jwt_token: token
        };
        var respMes = encrypt(JSON.stringify(da));
        return res.status(200).json({ statusCode: 200, encText: respMes })
      }else{
        var respMes = encrypt('Invalid Username or password');
        return res.status(409).json({encText: respMes})
      }
  });
  
  
  } else {
    var respMes = encrypt('NO SUCH USER EXISTS');
    return res.status(409).json({encText: respMes})
  }


});

// zxmbsmksiqlrhufz
// Forgor Password
router.post('/forgot_password', async function (req, res, next) {
  req.body = decrypt(req.body)
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email) == false) {
    var respMes = encrypt('Invalid Email');
    return res.status(409).json({ statusCode: 409, encText: respMes })
  }
var name = 'Praneeth Byna';
var os = 'Google Pixel';
var time = 'Apr 20th 23';
var token = null;  
var tokenURL = "";
    var data = await db.User.findOne({email:req.body.email});
      if(data){
        // Send Email to user
        
        await crypto.randomBytes(20, (err, buf) => {
           token = buf.toString("hex");
           console.log('token',token);
           data.resetPasswordToken = token;
           data.resetPasswordExpires = Date.now() + 36000; // ms, 1 minute
           data.save();
           tokenURL = "http://" + req.headers.host + "/api/v1.0/user/reset-password/" + token;
           let smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: 'splititwithease@gmail.com',
              pass: 'zxmbsmksiqlrhufz'
            }
          });
          let mailOptions = {
            from: 'splititwithease@gmail.com',
            to: req.body.email,
            subject: "Request for Password Reset",
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" style="color-scheme: light dark; supported-color-schemes: light dark;">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title></title>
<style type="text/css" rel="stylesheet" media="all">
/* Base ------------------------------ */

@import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&amp;display=swap");
body {
width: 100% !important;
height: 100%;
margin: 0;
-webkit-text-size-adjust: none;
}

a {
color: #3869D4;
}

a img {
border: none;
}

td {
word-break: break-word;
}

.preheader {
display: none !important;
visibility: hidden;
mso-hide: all;
font-size: 1px;
line-height: 1px;
max-height: 0;
max-width: 0;
opacity: 0;
overflow: hidden;
}
/* Type ------------------------------ */

body,
td,
th {
font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
}

h1 {
margin-top: 0;
color: #333333;
font-size: 22px;
font-weight: bold;
text-align: left;
}

h2 {
margin-top: 0;
color: #333333;
font-size: 16px;
font-weight: bold;
text-align: left;
}

h3 {
margin-top: 0;
color: #333333;
font-size: 14px;
font-weight: bold;
text-align: left;
}

td,
th {
font-size: 16px;
}

p,
ul,
ol,
blockquote {
margin: .4em 0 1.1875em;
font-size: 16px;
line-height: 1.625;
}

p.sub {
font-size: 13px;
}
/* Utilities ------------------------------ */

.align-right {
text-align: right;
}

.align-left {
text-align: left;
}

.align-center {
text-align: center;
}

.u-margin-bottom-none {
margin-bottom: 0;
}
/* Buttons ------------------------------ */

.button {
background-color: #3869D4;
border-top: 10px solid #3869D4;
border-right: 18px solid #3869D4;
border-bottom: 10px solid #3869D4;
border-left: 18px solid #3869D4;
display: inline-block;
color: #FFF;
text-decoration: none;
border-radius: 3px;
box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
-webkit-text-size-adjust: none;
box-sizing: border-box;
}

.button--green {
background-color: #22BC66;
border-top: 10px solid #22BC66;
border-right: 18px solid #22BC66;
border-bottom: 10px solid #22BC66;
border-left: 18px solid #22BC66;
}

.button--red {
background-color: #FF6136;
border-top: 10px solid #FF6136;
border-right: 18px solid #FF6136;
border-bottom: 10px solid #FF6136;
border-left: 18px solid #FF6136;
}

@media only screen and (max-width: 500px) {
.button {
width: 100% !important;
text-align: center !important;
}
}
/* Attribute list ------------------------------ */

.attributes {
margin: 0 0 21px;
}

.attributes_content {
background-color: #F4F4F7;
padding: 16px;
}

.attributes_item {
padding: 0;
}
/* Related Items ------------------------------ */

.related {
width: 100%;
margin: 0;
padding: 25px 0 0 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
}

.related_item {
padding: 10px 0;
color: #CBCCCF;
font-size: 15px;
line-height: 18px;
}

.related_item-title {
display: block;
margin: .5em 0 0;
}

.related_item-thumb {
display: block;
padding-bottom: 10px;
}

.related_heading {
border-top: 1px solid #CBCCCF;
text-align: center;
padding: 25px 0 10px;
}
/* Discount Code ------------------------------ */

.discount {
width: 100%;
margin: 0;
padding: 24px;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
background-color: #F4F4F7;
border: 2px dashed #CBCCCF;
}

.discount_heading {
text-align: center;
}

.discount_body {
text-align: center;
font-size: 15px;
}
/* Social Icons ------------------------------ */

.social {
width: auto;
}

.social td {
padding: 0;
width: auto;
}

.social_icon {
height: 20px;
margin: 0 8px 10px 8px;
padding: 0;
}
/* Data table ------------------------------ */

.purchase {
width: 100%;
margin: 0;
padding: 35px 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
}

.purchase_content {
width: 100%;
margin: 0;
padding: 25px 0 0 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
}

.purchase_item {
padding: 10px 0;
color: #51545E;
font-size: 15px;
line-height: 18px;
}

.purchase_heading {
padding-bottom: 8px;
border-bottom: 1px solid #EAEAEC;
}

.purchase_heading p {
margin: 0;
color: #85878E;
font-size: 12px;
}

.purchase_footer {
padding-top: 15px;
border-top: 1px solid #EAEAEC;
}

.purchase_total {
margin: 0;
text-align: right;
font-weight: bold;
color: #333333;
}

.purchase_total--label {
padding: 0 15px 0 0;
}

body {
background-color: #F4F4F7;
color: #51545E;
}

p {
color: #51545E;
}

p.sub {
color: #6B6E76;
}

.email-wrapper {
width: 100%;
margin: 0;
padding: 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
background-color: #F4F4F7;
}

.email-content {
width: 100%;
margin: 0;
padding: 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
}
/* Masthead ----------------------- */

.email-masthead {
padding: 25px 0;
text-align: center;
}

.email-masthead_logo {
width: 94px;
}

.email-masthead_name {
font-size: 16px;
font-weight: bold;
color: #A8AAAF;
text-decoration: none;
text-shadow: 0 1px 0 white;
}
/* Body ------------------------------ */

.email-body {
width: 100%;
margin: 0;
padding: 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
background-color: #FFFFFF;
}

.email-body_inner {
width: 570px;
margin: 0 auto;
padding: 0;
-premailer-width: 570px;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
background-color: #FFFFFF;
}

.email-footer {
width: 570px;
margin: 0 auto;
padding: 0;
-premailer-width: 570px;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
text-align: center;
}

.email-footer p {
color: #6B6E76;
}

.body-action {
width: 100%;
margin: 30px auto;
padding: 0;
-premailer-width: 100%;
-premailer-cellpadding: 0;
-premailer-cellspacing: 0;
text-align: center;
}

.body-sub {
margin-top: 25px;
padding-top: 25px;
border-top: 1px solid #EAEAEC;
}

.content-cell {
padding: 35px;
}
/*Media Queries ------------------------------ */

@media only screen and (max-width: 600px) {
.email-body_inner,
.email-footer {
width: 100% !important;
}
}

@media (prefers-color-scheme: dark) {
body,
.email-body,
.email-body_inner,
.email-content,
.email-wrapper,
.email-masthead,
.email-footer {
background-color: #333333 !important;
color: #FFF !important;
}
p,
ul,
ol,
blockquote,
h1,
h2,
h3,
span,
.purchase_item {
color: #FFF !important;
}
.attributes_content,
.discount {
background-color: #222 !important;
}
.email-masthead_name {
text-shadow: none !important;
}
}

:root {
color-scheme: light dark;
supported-color-schemes: light dark;
}
</style>
<!--[if mso]>
<style type="text/css">
.f-fallback  {
font-family: Arial, sans-serif;
}
</style>
<![endif]-->
<style type="text/css" rel="stylesheet" media="all">
body {
width: 100% !important;
height: 100%;
margin: 0;
-webkit-text-size-adjust: none;
}

body {
font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
}

body {
background-color: #F4F4F7;
color: #51545E;
}
</style>
</head>
<body style="width: 100% !important; height: 100%; -webkit-text-size-adjust: none; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; background-color: #F4F4F7; color: #51545E; margin: 0;" bgcolor="#F4F4F7">
<span class="preheader" style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">Use this link to reset your password. The link is only valid for 24 hours.</span>
<table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F4F4F7; margin: 0; padding: 0;" bgcolor="#F4F4F7">
<tr>
<td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
  <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; margin: 0; padding: 0;">
    <tr>
      <td class="email-masthead" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; text-align: center; padding: 25px 0;" align="center">
        <a href="https://example.com" class="f-fallback email-masthead_name" style="color: #A8AAAF; font-size: 16px; font-weight: bold; text-decoration: none; text-shadow: 0 1px 0 white;">
        Splitit App
      </a>
      </td>
    </tr>
    <!-- Email Body -->
    <tr>
      <td class="email-body" width="100%" cellpadding="0" cellspacing="0" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF; margin: 0; padding: 0;" bgcolor="#FFFFFF">
        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFFFFF; margin: 0 auto; padding: 0;" bgcolor="#FFFFFF">
          <!-- Body content -->
          <tr>
            <td class="content-cell" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
              <div class="f-fallback">
                <h1 style="margin-top: 0; color: #333333; font-size: 22px; font-weight: bold; text-align: left;" align="left">Hi ${name},</h1>
                <p style="font-size: 16px; line-height: 1.625; color: #51545E; margin: .4em 0 1.1875em;">You recently requested to reset your password for your Splitit account. Use the button below to reset it. <strong>This password reset is only valid for the next 15 minutes.</strong></p>
                <!-- Action -->
                <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; margin: 30px auto; padding: 0;">
                  <tr>
                    <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                      <!-- Border based button
   https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                        <tr>
                          <td align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                            <a href=${tokenURL} class="f-fallback button button--green" target="_blank" style="color: #FFF; background-color: #22BC66; display: inline-block; text-decoration: none; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); -webkit-text-size-adjust: none; box-sizing: border-box; border-color: #22BC66; border-style: solid; border-width: 10px 18px;">Reset your password</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 16px; line-height: 1.625; color: #51545E; margin: .4em 0 1.1875em;">For security, this request was received from a ${os} device at ${time}. If you did not request a password reset, please ignore this email or <a href="{{support_url}}" style="color: #3869D4;">contact support</a> if you have questions.</p>
                <p style="font-size: 16px; line-height: 1.625; color: #51545E; margin: .4em 0 1.1875em;">Thanks,
                  <br />Team Splitit</p>
                <!-- Sub copy -->
                <table class="body-sub" role="presentation" style="margin-top: 25px; padding-top: 25px; border-top-width: 1px; border-top-color: #EAEAEC; border-top-style: solid;">
                  <tr>
                    <td style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
                      <p class="f-fallback sub" style="font-size: 13px; line-height: 1.625; color: #6B6E76; margin: .4em 0 1.1875em;">If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>
                      <p class="f-fallback sub" style="font-size: 13px; line-height: 1.625; color: #6B6E76; margin: .4em 0 1.1875em;">${tokenURL}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px;">
        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width: 570px; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center; margin: 0 auto; padding: 0;">
          <tr>
            <td class="content-cell" align="center" style="word-break: break-word; font-family: &quot;Nunito Sans&quot;, Helvetica, Arial, sans-serif; font-size: 16px; padding: 35px;">
              <p class="f-fallback sub align-center" style="font-size: 13px; line-height: 1.625; text-align: center; color: #6B6E76; margin: .4em 0 1.1875em;" align="center">
                Splitit
                <br />308 N Duncan St.
                <br />Orange Door
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</td>
</tr>
</table>
</body>
    </html>
    `
          };
          // send the email
          smtpTransport.sendMail(mailOptions, err => {
            if (err) console.log(err);
            console.log("mail sent");
            // done(err, "done");
          });
        })
        var respMes = encrypt('MAIL SENT PLEASE FOLLOW THE INSTRUCTIONS');
        return res.status(200).json({statusCode:200,encText: respMes})
      }else{
        var respMes = encrypt('NO SUCH USER EXISTS');
        return res.status(409).json({statusCode:409,encText: respMes})
      }


});


router.get('/reset-password/:token', async function (req, res, next) {
  // res.send('respond with a resource');
  var user = await db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      // return res.status(409).json({statusCode:409,message:'Link Expired'});
      res.render("link_expired", { token: req.params.token });
    } else {
       res.render("reset", { token: req.params.token });
    }
});

router.post('/update_new_password', async function(req,res){
  req.body = decrypt(req.body)
    console.log(req.body);
    var user = await db.User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } });
    console.log(user)
    if (!user) {
      res.render("link_expired", { token: req.params.token });
    } else {
       if(req.body.password != req.body.confirm_password){
        var respMes = encrypt('Password does not match');
        return res.status(409).json({statusCode:409,encText: respMes});
       }else{

        await bcrypt.genSalt(2, async function(err, salt) {
          await bcrypt.hash(req.body.password, salt, function(err, hash) {
              // Store hash in your password DB.
              console.log(hash)
              req.body.password = hash;
              user.password = req.body.password;
              user.resetPasswordToken = null;
              user.save();
              return res.render('password_success')
          });
      });
      
       
        
       }
    }

});




module.exports = router;
