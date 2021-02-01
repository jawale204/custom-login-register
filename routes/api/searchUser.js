const express=require('express')
const config=require('config')
const {body, validationResult}=require('express-validator')
const router=express.Router()
const auth =require('../../middleware/auth')
const User = require('../../models/User')


router.post('/',
    [
    body('SearchText',"Search Text is required").not().isEmpty()
    ],async(req,res)=>{
        const error=validationResult(req)
        if(!error.isEmpty()){
            console.log(error)
            return res.status(400).json({errors:error.array})
        }
        try{
            console.log(req.body.SearchText)
            const user=await User.find({email:req.body.SearchText}).select('-password')
            if (user){
                console.log(user)
                
            }
            else{
                console.log("not found")
            }
        }catch(err){

        }
})

module.exports=router