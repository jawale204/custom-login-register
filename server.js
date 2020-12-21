const express=require('express')
const app=express()
const ConnectDB=require('./config/db')
const PORT=3000||process.env.PORT
ConnectDB()

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("API connected")
})
app.use('/api/user',require('./routes/api/auth'))
app.listen(PORT,()=>{
    console.log(`listening to PORT ${PORT}`)
})
