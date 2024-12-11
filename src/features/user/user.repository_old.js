import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserRepository{

    async signUp(newUser){
        try{
        //1. get Database
        const db = getDB();
        //2.get the collection
        const collection = db.collection("users");
        
       //3. Insert the document.
       await collection.insertOne(newUser);
       return newUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong in DB", 500)
        }
        
    }  
    async signIn(email,password){
        try{
        //1. get Database
        const db = getDB();
        //2.get the collection
        const collection = db.collection("users");
        
       //3. Insert the document.
       return await collection.findOne({email,password});
       
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong in DB", 500)
        }
        
    } 
    async findByEmail(email){
        try{
        //1. get Database
        const db = getDB();
        //2.get the collection
        const collection = db.collection("users");
        
       //3. Insert the document.
       return await collection.findOne({email});
       
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong in DB", 500)
        }
        
    }    
}