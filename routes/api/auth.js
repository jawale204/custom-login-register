const express=require('express')
const router=express.Router()
const {body,validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
const User=require('../../models/User')
const jwt=require('jsonwebtoken')
const config=require('config')
const auth=require('../../middleware/auth')
const nodemailer=require('nodemailer')


router.post('/register',[
    body('username',"Username is requied").not().isEmpty(),
    body('email',"Email is required").isEmail(),
    body('password',"Password is required").isLength({min:6})
],async(req,res)=>{
   const error=validationResult(req)
   if(!error.isEmpty()){
       console.log(error)
      return  res.status(404).json({msg:error.array()})
   }
   try{
    const user=await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send('User already exist')
    }
    const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        isVerified:false
    })
    const genSalt=await bcrypt.genSalt(10)
    newUser.password=await bcrypt.hash(req.body.password,genSalt)
    await newUser.save()
    const payload={
        user:{
            id:newUser.id
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
    const text=`Click on the link below to verfiy your account https://reddback.herokuapp.com/api/email/verify?token=${token}`;
   transporter.sendMail(
        {
            from:"jawale204@gmail.com",
            to:newUser.email,
            subject:"Account verification",
            text:text,
        },(err,info)=>{
            if (err) {
                console.log(err)
                return res.send({msg:"verification failed"})
        }
          console.log(info);
          transporter.close()
          return res.json({msg:"Mail Sent"})
         
     }
    )
    
   }catch(err){
        console.log(err)
        return res.status(500).send('server error')
   }
})

router.post('/login',[
    body('email',"Email is required").isEmail(),
    body('password',"Password is required").isLength({min:6})
],async(req,res)=>{

    const error=validationResult(req)
    if(!error.isEmpty()){
        console.log(error)
       return  res.status(404).json({msg:error.array()})
    }
    try{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).json({msg:"Invalid credentials"})
    }
    const isMatch=await bcrypt.compare(req.body.password,user.password)
    if(!isMatch){
        return res.status(404).json({msg:"Invalid credentials"})
    }
    if(!user.isVerified){
        return res.status(400).json({msg:"Email not verified"})
    }
    const payload={
        user:{
            id:user.id
        }
    }
    jwt.sign(payload,config.get('secret'),{expiresIn:"1d"},(err,token)=>{
        if(err) console.log(err)
        return res.json({"token":token})
    })
   }catch(err){
    console.log(err)
    return res.status(500).send('server error')
   }
})

module.exports=router