import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bycrypt from 'bcrypt';
import mongoose from "mongoose";

export default class UserController{
  constructor(){
    this.userRepository = new UserRepository();
  }

    async signUp(req,res,next){
      try{
        const {name,email,password,type}= req.body;
        const hashedPassword = await bycrypt.hash(password,12)
       const user= new UserModel(name,email,hashedPassword,type);
       await this.userRepository.signUp(user)
       res.status(201).send(user);
      }catch(err){
        next(err);
        console.log(err);
        if(err instanceof mongoose.Error.ValidationError){
          throw err;
        }
        throw new ApplicationError("Something went wrong", 500)
      }
        
    }
    async signIn(req,res, next){
      try{
        //find user by email
        const user = await this.userRepository.findByEmail(req.body.email);
        if(!user){
          return res.status(400).send("Incorrect Credentials");
        }else{

          //compare password with hashed password
          const result = await bycrypt.compare(req.body.password, user.password);
          
          if(!result){
            console.log("hashed password compare");
            return res.status(400).send("Incorrect Credentials");
          }else{
            //create token
           
            const token = jwt.sign({userID:user._id, email:user.email},process.env.JWT_SECRET,{expiresIn:'1h',})
            return res.status(200).send(token);
          }
        }

    }catch(err){
      console.log(err);
      return res.status(500).send("internal server error");
    }
    }

    async resetPassword(req,res,next){
      const{newPassword} = req.body;
      const userID = req.userID;
      const hashedPassword = await bycrypt.hash(newPassword, 12);
      try{
        await this.userRepository.resetPassword(userID, hashedPassword);
        res.status(200).send("Password is reset")
      }catch(err){
        console.log(err);
        return res.status(500).send("internal server error");
      }
    }
}