const mongoose=require('mongoose');
const conditionsSchema=mongoose.Schema({
    Location:{
          type:String,
          required:true
    },
     Weather:{
        type:Number,
    required:true
     },
    season:{
       type:String,
        required:true
    },
    cropname:{
        type:String,
        required:true,
    }
   
},{timestamps:true})
const Cropsuggest=mongoose.model('selections',conditionsSchema);
module.exports=Cropsuggest;