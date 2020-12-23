const mongoose= require('mongoose')
const Schema=mongoose.Schema
const User=require('./User')

const Token =new Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:User
    }
})