import express from 'express';
import { MongoClient } from 'mongodb';
// import dotenv from 'dotenv'
 import cors from 'cors'
import nodemailer from 'nodemailer'
import {auth} from './auth.js'

//import {logins} from './loginrouter.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//variables
var app = express()  
// dotenv.config()
 app.use(express.json());
 app.use(cors())

//var mongoUrl="mongodb://localhost"


//create server with mongo
var mongoUrl = "mongodb://localhost"
async function createConnection(){
    var client = new MongoClient(mongoUrl);
    await client.connect()
    console.log("connection is ready ")
 return client
}
export var client = await createConnection()

async function passwordMatch(pass){
    var salt = await bcrypt.genSalt(4);
    var hash = await bcrypt.hash(pass,salt);
    return hash;
}
app.get("/home",auth,function (req,res){
       res.send({msg:"hello"})
})
app.post("/signin",async function(req,res){
    let {email,password} = req.body
    let hash = await passwordMatch(password)
    let result = await client.db("product").collection("users").insertOne({email,"password":hash})
    res.send(result)
})
  app.post("/login",async function(req,res){
    let {email,password}=req.body;
    let result =await client.db("product").collection("users")
    .findOne({email});
    if(!result){
        res.status(401).send({msg:"invalid"})
    }else{
        var storedPassword = result.password
        var compare = await bcrypt.compare(password,storedPassword)
        if(!compare){
            res.status(401).send({msg:"invalid"})
        }else{
            const token = await jwt.sign({id:result._id},"santhosh");
            async function nodemail(){
                var transfer = nodemailer.createTransport({
                    service:"hotmail",
                    auth:{
                       user:"santhoshbalaji304@gmail.com",
                       pass:"santhosh1234"
                    }
                 
                 })
                   const options={
                    from:"santhoshbalaji304@gmail.com",
                    to:email,
                    subject:"your login",
                    text:"your login critical mail"
                   }
                 
                   transfer.sendMail(options,(err)=>{
                    if(err){
                       console.log(err)
                    }else{
                       console.log({msg:"mail send"})
                    }
                   })
                   transfer.verify()
                }
                nodemail()
                res.send({msg:"login sucessfully",token:token})
        }
    }
  })

app.post("/fpw",async function(req,res){
    let {email}=req.body;
    let result =await client.db("product").collection("users")
    .findOne({email});
    if(!result){
        res.status(401).send({msg:"invalid"})
    }else{
        var randomNumber = Math. floor(100000 + Math. random() * 900000)
        async function nodemail(){
            var transfer = nodemailer.createTransport({
                service:"hotmail",
                auth:{
                   user:"santhoshbalaji304@gmail.com",
                   pass:"santhosh1234"
                }
             
             })
               const options={
                from:"santhoshbalaji304@gmail.com",
                to:email,
                subject:"your login",
                text:`OTP${randomNumber} `
               }
             
               transfer.sendMail(options,(err)=>{
                if(err){
                   console.log(err)
                }else{
                   console.log({msg:"mail send"})
                }
               })
               transfer.verify()
            }
            nodemail()
            res.send({msg:"autheticating",OTP:randomNumber})
    }
})

app.listen(4000,()=>{
    console.log("get it")
})