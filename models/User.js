const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        require:true
    }
})

module.exports=User=mongoose.model("User",userSchema)