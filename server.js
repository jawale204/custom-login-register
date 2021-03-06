const express=require('express')
const app=express()
const ConnectDB=require('./config/db')
const PORT=process.env.PORT||3000
ConnectDB()

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("API connected")
})
app.use('/api/user',require('./routes/api/auth'))
app.use('/api/email',require('./routes/api/verifyemail'))
app.use('/api/SearchUser',require('./routes/api/searchUser'))

app.listen(PORT,()=>{
    console.log(`listening to PORT ${PORT}`)
})
