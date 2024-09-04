const express=require('express');
const mongoose =require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors=require('cors');
// validate
let namepattern=/^[A-z][a-z]+$/
let passwordpattern=/^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[@#$%^&-+=()])(?=\S+$).{8,20}$/;
// /^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[@#$%^&-+=()])(?=\S+$).{8,20}$/;


// database connection
mongoose.connect("mongodb://localhost:27017/Framease")
.then(()=>{
    console.log("database connected successfully")
})
.catch((err)=>{
    console.log(err)
})
// import models
const userModel=require('./Models/userModel');
const Cropsuggest=require('./Models/Cropsuggest');
const Season=require('./Models/Season');
const Marketprice=require('./Models/Marketprice');
const app=express();
app.use(express.json());
app.use(cors());
//  end points register user
app.post('/register',(req,res)=>{
    let user=req.body;
    console.log(user.password)
    bcrypt.genSalt(10,(err,salt)=>{
        if(!err){
            if (namepattern.test(user.name)) {
                console.log("correct");
            } else {
                console.log('error');
                return res.status(400).send({ message: "Name should contain only letters" });
            }
            bcrypt.hash(user.password,salt,async(err,hpass)=>{
                if(!err){
                    user.password=hpass;
                    try{
                        const existuser=await userModel.findOne({email:user.email})
                        if(existuser){
                            return res.status(400).send({message:"Already email exist"})
                        }
                        else{
                        let doc=await userModel.create(user)
                        res.status(201).send({message:"user registerd sucessfully"});
                        }
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).send({message:"Some Problem while registering"})
                    }
                }
            })

        }
    })
})
// endpoint for login
app.post('/login',async (req,res)=>{
    let userCred=req.body;
    try{
        const user=await userModel.findOne({email:userCred.email})
        if(user!=null){
            bcrypt.compare(userCred.password,user.password,(err,sucess)=>{
                if(sucess==true){
                    jwt.sign({email:userCred.email},"Nani",(err,token)=>{
                        if(!err){
                            res.status(200).send({message:"Login sucess",token:token,name:user.name,id:user._id})
                        }
                       
                    })
                }
                else{
                    res.status(403).send({message:"Incorrect password"});
                }
            })
        }
        else{
            res.status(404).send({message:"user not found enter valid email"});
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem"})
    }
})
//end point for adding crops 
app.post('/addcrop',async(req,res)=>{
    let cropbody=req.body
    
   if(cropbody!=null){
    try{
        let select=await Cropsuggest.create(cropbody)
        res.status(201).send({message:"crops added succesfully"});
   
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"some problem arrived in adding crops"});
    }

}

})
app.get('/crop/:location',async (req,res)=>{
    let locationname=req.params.location
    if(locationname!=null){
        try{
            let details=await Cropsuggest.find({
                Location:locationname})
                res.status(200).send(details)
        }
        catch(err){
            res.status(403).send({message:"enter valid location"})
        }
    }
    else{
        res.status(404).send({message:"location is not found"})
    }
})
app.post('/season',async (req,res)=>{
    let Seasonname=req.body;
   // console.log(Seasonname);
    if(Seasonname!=null){
        try{
            let doc1=await Season.create(Seasonname)
            res.status(201).send({message:"season added succesfully"});
        }
        catch(err){
            console.log(err);
        res.status(500).send({message:"some problem arrived in adding season"});
        }
    }
})
app.get('/Season/:Cropname',async(req,res)=>{
    let cropname=req.params.Cropname
    if(cropname!=null){
        try{
            let seasondetails=await Season.find({crop:cropname})
            res.status(200).send(seasondetails)
        }
        catch(err){
            res.status(403).send({message:"enter valid crop"})
        }
    }
    else{
        res.status(404).send({message:"crop is not found"})
    }
        })
app.post('/price', async (req,res)=>{
   let marketprice=req.body;
 
    if (marketprice!=null) {
       
        try{
            let doc2=await Marketprice.create(marketprice)
        console.log(doc2)
            res.status(201).send({message:"market prices added succesfully"});
        }
        catch(err){
            console.log(err);
            res.status(500).send({message:"some problem arrived in adding prices"});
        }
    }})
app.get('/Marketprice/:cropname', async (req,res)=>{
    let Cropname=req.params.cropname
   // let season=req.params.season
    if(Cropname!=null){
      {
        try{
            let pricedetails=await Marketprice.find({crop:Cropname})
            res.status(200).send(pricedetails)
        }
        catch(err){
            res.status(403).send({message:"enter valid crop and valid season"})  
              }
  }
    
   }
   else{
        res.status(404).send({message:"crop or season  not found"})
    }
})
app.listen(8060,()=>{
    console.log("server running up and down");
 })