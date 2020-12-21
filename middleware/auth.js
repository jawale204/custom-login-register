const config=require('config')
const jwt=require('jsonwebtoken')

auth=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token){
       return res.status(401).json({msg:"No token,authentication failed"})
    }
    try{
        const decoded=jwt.verify(token,config.get('secret'))
        req.user=decoded.user
        console.log(req.user)
        next()
    }catch(err){
        res.status(401).send({msg:"token is not valid"})
    }
    
}
module.exports=auth