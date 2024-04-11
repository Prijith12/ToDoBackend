const mongoose= require('mongoose');
module.exports={
connect:(url)=>{mongoose.connect(url).then((result)=>{
        console.log('Connected with the mongoDB database')
    }).catch((err)=>{
        console.log(err);
    })}

}

