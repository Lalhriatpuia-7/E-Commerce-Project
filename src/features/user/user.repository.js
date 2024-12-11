import mongoose from "mongoose";
import{userSchema} from "./user.schema.js"
import { ApplicationError } from "../../error-handler/applicationError.js";

const UserModel = mongoose.model('User', userSchema)

export default class UserRepository{
    async signUp(user){

        try{
        const newUser = new UserModel(user);
        await newUser.save();
        }catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                throw new ApplicationError("something went wrong with database", 500)
            }
            
        }
    }

    async signIn(email, password){
        try{
            return await UserModel.findOne({email, password});
            }catch(err){
                console.log(err);
                throw new ApplicationError("something went wrong with database", 500)
            }
    }
    async findByEmail(email){
        try{
        return await UserModel.findOne({email});
       
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong in DB", 500)
        }
        
    }  
    async resetPassword(userID, newPassword){
        try{
            let user = await UserModel.findById(userID);
            if(user){
                user.password = newPassword;
                user.save();
            }else{
                throw new Error("USer not found")
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong in DB", 500)
        }
    }  
}