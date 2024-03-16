const express = require("express");
const router = express.Router();
const User = require("../modals/user");
const expense = require("../modals/expense");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const AWS = require("aws-sdk");
const download = require('../modals/download');

//uploading to s3 function
function uploadToS3(data, fileName) {
    const  BUCKET_NAME = 'expensetrackingapp6398';
    const IAM_USER_KEY = "AKIAVRUVWGINX2UJN2VS";
    const  IAM_USER_SECRET = "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";
  
    const s3Bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      
  
    });
  
   
      var param = {
        Bucket : BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: "public-read",
      }

      return new Promise((resolve,reject)=>{
        s3Bucket.upload(param,(err,s3response)=>{
            if(err){
              console.log('something went wrong', err);
            }else{
              console.log('succerss', s3response);
              resolve(s3response)
            }
          })
      })
      
    
  }

exports.downloadexpense = async (req, res) => {
  
    const id = req.user.id;
    const username = req.user.name
 
  
    const expenses = await expense.findAll({
      where: {
        userSignupId: id,
        // You should hash the password and compare it securely
      },
    });
 
  
    try {
        
      const expensesToString = JSON.stringify(expenses);
      const fileName = `Expense${username}/${new Date()}.txt`;
      const s3response = await uploadToS3(expensesToString, fileName);

      const newdownload = await download.create({
        url: s3response.Location,
        userSignupId: id
    })
    
      return res.json({ fileUrl: s3response.Location, success: true });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ success: false, msg: "Internal server error",error:e });
    }
  }