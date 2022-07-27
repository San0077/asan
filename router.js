import express from 'express';
import bcrypt from 'bcrypt'
import { client } from './index.js';

var router = express.Router()

router.get("/",async function(req,res){
    let result =await client.db("movie").collection("mov").find({})
    .toArray()
    res.send(result)
})
router.get("/:id",async function(req,res){
    var {id} = req.params
    let result =await client.db("movie").collection("mov").find({id:id}).toArray()
   res.send(result)
})
router.put("/:id",async function(req,res){
    var {id}=req.params
    var data = req.body
    let result =await client.db("movie").collection("mov").updateOne({id:id},{$set:data})
  
    res.send(result)
})
async function passwordCreate (pass){
    const salt = await bcrypt.genSalt(4)
    const hash = await bcrypt.hash(pass,salt)
    
    return hash;
}
router.post("/",async function(req,res){
    var {username,password} = req.body
    var pass = await passwordCreate(password)
    let result =await client.db("movie").collection("users").insertOne({username,"password":pass})
    res.send(result)
   
})
export const home = router
export const signup = router

export const bookYourSeats = router
export const getonemovie = router