require('dotenv').config()
var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const userToDo=require('../models/toDo');
const verifyUser=require('../middleware/isAuth');

router.post('/signUp', async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.json({ message: "Missing required fields",success:false})
    }
    try{
        const existingUser= await User.findOne({email:email})
    if(existingUser){
        res.json({message:"User already exist",success:false})
    }else{
        const newUser= await User({
            name,
            email,
            password:bcrypt.hashSync(password,10)
        })
        const user= await newUser.save();
        const userDetails={
            name:user.name,
            email:user.email
        }
        const token=await jwt.sign(userDetails,'todoPritech123',{ expiresIn: '1h' })
        res.json({success:true,token});
    }

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"})
    }
    
})

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    if ( !email || !password) {
        res.json({ message: "Missing required fields",success:false})
    }
    try{
        let user=await User.findOne({email:email});
        if(!user){
            res.json({message:"Invalid email or password",success:false});
        }else{
            const result=await bcrypt.compare(password,user.password);
            if(result){
                const userDetails={
                    name:user.name,
                    email:user.email
                }
                const token=await jwt.sign(userDetails,'todoPritech123',{expiresIn: '1h'});
                res.json({success:true,token});
            }else{
                res.json({message:"password is incorrect",success:false})
            }
        }
    }catch(err){
        res.status(500).json({message:err,success:false})
    }

})

router.post('/addToDo',verifyUser,async(req,res)=>{
    let {id,value,status}=req.body
    const data=await userToDo.findOne({emailId:req.user.email});
    if(!data){
        const toDo=await userToDo({
            emailId:req.user.email,
            toDos:[{id,value,status}]
        })
        const result=await toDo.save();
        res.json({result,success:true})
    }else{
        data.toDos.push({id,value,status});
        const result=await data.save();
        res.json({result,success:true})

    }
})
 
 router.get('/viewToDo',verifyUser,async(req,res)=>{
    try{
        const toDos=await userToDo.findOne({emailId:req.user.email});
        res.json({toDos,success:true});
    }catch(err){
        console.log(err);
        res.json({message:"Please login",success:false})
    }

 })
 router.post('/UpdateStatus/:id',verifyUser,async(req,res)=>{
    const status=!req.body.status
    const id=req.params.id;
    try{
        const result=await userToDo.findOneAndUpdate({emailId:req.user.email,'toDos.id':id},
    {
        $set:{
            'toDos.$.status':status
        }
    });
    res.json({result,success:true});
    }catch(err){
        res.json({message:"Error updating the completion status",success:false})
    }
    

 });
  router.post('/deleteToDo/:id',verifyUser,async(req,res)=>{
    const id=req.params.id;
    try{
        const result=await userToDo.findOneAndUpdate({emailId:req.user.email},{
            $pull:{
                toDos:{id:id}
            }
        },{
            new:true
        })
        res.json({result,success:true});
    }catch(err){
      res.json({message:"Error deleting the toDo",success:false});  
    }
    
  });
module.exports = router;
