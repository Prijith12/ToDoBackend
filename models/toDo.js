const mongoose=require('mongoose');

const toDoSchema=new mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    value:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    }
})

const userToDos=new mongoose.Schema({
    emailId:{
        type:String,
        require:true
    },
    toDos:[toDoSchema]
    
})

const userToDo=mongoose.model('userToDo',userToDos);
module.exports=userToDo;