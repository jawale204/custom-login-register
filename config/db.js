const mongoose=require('mongoose')
const config=require('config')
const DB=config.get('mongodbURI')

const ConnectDB = async ()=>{
    try{
     await mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology:true})
     console.log('MongoDB connected')
    }catch(err){
        console.log(err)
    }  
}

module.exports=ConnectDB