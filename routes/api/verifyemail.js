const express=require('express');
const jwt= require('jsonwebtoken');
const router=express.Router()
const config=require('config')
const User=require('../../models/User')
const {body,validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')

router.get("/verify",async(req,res)=>{
    const token =req.query.token;
    
    if (token){
        try{
            jwt.verify(token,config.get('secret'),async (err,payload)=>{
                if(err){
                    console.log(err);
                    return res.status(403).json({msg:"invalid token"})
                    }
                console.log(payload.user.id)
                const user=await User.findById(payload.user.id).select('-password');
                if(!user){
                    console.log("user does not exist")
                    return res.status(400).json({msg:"User does not exist"})
                }
                if(user.isVerified){
                    return res.json({msg:"User already Verified"})
                }
                user.isVerified=true;
                user.save();
                return res.json({msg:" User Verified "})
            })  
        }catch(err){
            console.log(err)
            return res.send('Server error')
        }
       
    }
})

router.post("/resendverify",[
body('email',"email is requires").isEmail(),
body('password',"password is required").not().isEmpty()
],async(req,res)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        console.log(error)
       return  res.status(404).json({msg:error.array()})
    }
    try{
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({msg:"Invalid credentials"})
        }
        const isMatch=await bcrypt.compare(req.body.password,user.password)
        if(!isMatch){
            return res.status(404).json({msg:"Invalid credentials"})
        }
        if(user.isVerified){
            return res.json({msg:"User already Verified"})
        }
        const payload={
            user:{
                id:user.id
            }
        }
        
        const token=jwt.sign(payload,config.get('secret'),{expiresIn:"1d"})
        let transporter=nodemailer.createTransport(
            {   type: 'OAuth2',
                host:"smtp.gmail.com",
                secure:true,
                port:465,
                auth:{
                    user:config.get('serveremail'),
                    pass:config.get('serveremailpassword')
                }
            }
        );
        const text=`Click on the link below to verfiy your account 
        https://reddback.herokuapp.com/api/email/verify?token=${token}`;
       transporter.sendMail(
            {
                from:"jawale204@gmail.com",
                to:user.email,
                subject:"Account verification",
                text:text,
            },(err,info)=>{
                if (err) {
                    console.log(err)
                    return res.ststus(400).json({msg:"verification failed"})
            }
              console.log(info);
              transporter.close()
              return res.json({msg:"Mail Sent"})
             
         }
        )
    }catch(err){
        console.log(err)
        return res.send('Server error')
    }
 
})

module.exports=router