require('dotenv').config()
const jwt=require('jsonwebtoken');
const verifyUser=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader){
        return res.json({message:'notAuth'});
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,'todoPritech123',(err,decode)=>{
        if(err){
            return res.json({message:'notAuth'});
        }else{
            req.user=decode;
            next();
        }
    })

}
module.exports=verifyUser;