import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js"
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemRepository{
    constructor(){
        this.collection = "cartItems"
    }

    async add(productID,userID,quantity){
        try{
        const db = getDB();
        const collection = db.collection(this.collection);

        const id = await this.getNextCounter(db);
            console.log(id);
        await collection.updateOne({
            productID: new ObjectId(productID),userID:new ObjectId(userID)
        },
    {
        $setOnInsert:{_id:id},
        $inc:{
            quantity:quantity
        }
    },{
        upsert:true
    })

    //     collection.insertOne({
    //         productID: new ObjectId(productID),userID:new ObjectId(userID),quantity
    //     })
    }catch(err){
        console.log(err);
        throw new ApplicationError("something went wrong with database", 500);
    }
    }

    async get(userID){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
    
            const cart = collection.find({userID:new ObjectId(userID)}).toArray();
            return cart;
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }
    async delete(userID, productID){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            
            const result =await collection.deleteOne({userID:new ObjectId(userID), productID:new ObjectId(productID)});
            return result.deletedCount>0
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }

    async getNextCounter(db){
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value:1}},
            {ReturnDocument:'after'})
    console.log(resultDocument.value);
    return resultDocument.value;
    }
}