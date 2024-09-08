const express = require('express')
const mongoose=require('mongoose')
const bcrypt =require('bcrypt')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const userModel=require('./models/user')

const app =express()
app.use(express.json())
app.use(cors())
const generateHashedpassword = async(password)=>{
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
//signup
mongoose.connect("mongodb+srv://adilafarhanavv:0987adi7890@cluster0.4nikuym.mongodb.net/taskapp?retryWrites=true&w=majority&appName=Cluster0")
app.post("/signup",async(req,res)=>{
    let input=req.body
    let generateHashedpassword=bcrypt.hashSync(req.body.password,10)
    req.body.password=generateHashedpassword
   
    userModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                res.json({"status":"email id already exist"})
                
            } else {
                let result=new userModel(input)
                result.save()
                res.json({"status":"success"})

                
            }
            
        }
    ).catch(
    (error)=>{}
    )
})
app.post("/signin",async(req,res)=>{
    let input=req.body
    let result=userModel.find({ email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                const passwordvalidator=bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordvalidator) {
                    jwt.sign({email:req.body.email},"taskapp",{expiresIn:"1d"},
                    (error,token)=>{
                   if (error) {
                    res.json({"status":"error","error":error})
                   } 
                   else {
                    res.json({"status":"success","token":token,"userid":items[0]._id})
                   }
                    })
                } else {
                    res.json({"status":"invalid password"})
                    
                }
            } else {
                res.json({"status":"invalid email"})
                
            }
        }
    ).catch()
})
         
       
        app.listen(3050,()=>{
            console.log("server started")
        })
