import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export class UserModel{
    constructor(name,email,password,type,id){
        this.name = name,
        this.email = email,
        this.password = password,
        this.type = type,
        this._id = id
    } 
    //  static async signUp(name,email,password,type){
    //     try{
    //     //1. get Database
    //     const db = getDB();
    //     //2.get the collection
    //     const collection = db.collection("users");
    //     const newUser = new UserModel(name,email,password,type);
    //    //3. Insert the document.
    //    await collection.insertOne(newUser);
    //    return newUser;
    //     }catch(err){
    //         throw new ApplicationError("Something went wrong", 500)
    //     }
        
    // }   
    // static signIn(email,password){
    //     const user = users.find(user=> user.email == email && user.password == password);
    //     return user;
    // }
    static getAll(){
        return users;
    }
}

var users = [
    {
        id: 1,
        name: "Seller User",
        email: "seller@admin.com",
        password: "password1",
        type: "seller",
    },
    {
        id: 2,
        name: "Customer User",
        email: "customer@admin.com",
        password: "password1",
        type: "customer",
    }
]