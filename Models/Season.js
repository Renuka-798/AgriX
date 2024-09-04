const mongoose=require('mongoose');
const seasonSchema=mongoose.Schema({
    crop:{
        type:String,
        required:true
    },
    season:{
        type:String,
        required:true
    },
    weather:{
        type:Number,
        required:true
    }
},{timestamps:true})
const Season=mongoose.model('seasons',seasonSchema);
module.exports=Season;