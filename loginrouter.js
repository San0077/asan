import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { client } from './index.js';
import dotenv from 'dotenv'
import express from 'express';
import nodemailer from 'nodemailer'

var login = express.Router()


login.post("/",async function(req,res){
    var {username,password} = req.body
    let result =await client.db("movie").collection("users")
    .findOne({username});
    if(!result){
         return res.status(401).send({msg:"invalid creditial"})
       
    }else{
     const storedPassword = result.password;
     var comparepassword = await bcrypt.compare(password,storedPassword);
     if(comparepassword){
        const token = await jwt.sign({id:result._id},process.env.key)

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
            to:username,
            subject:"sending mail from the scratch",
            text:"hello this is santhosh am from the guvi network"
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
     }else{
        res.status(401).send({msg:"invalid creditial"})
     }
   }

})

export const logins = login