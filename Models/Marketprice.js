const mongoose=require('mongoose');
const MarketPriceSchema=mongoose.Schema({
    crop:{
        type:String,
        required:true
    },
    season:{
        type:String,
        required:true
    },
    MarketPrice:{
        type:Number,
        required:true
    }
},{timestamps:true})
const Marketprice=mongoose.model('prices',MarketPriceSchema);
module.exports=Marketprice;