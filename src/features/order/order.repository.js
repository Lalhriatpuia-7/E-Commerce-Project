import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import {ApplicationError} from "../../error-handler/applicationError.js";


export default class OrderRepository{

    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId) {
        let session;
        try {
            const client = getClient();
            session = client.startSession();
            const db = getDB();
    
            await session.startTransaction(); // Ensure the transaction starts properly
    
            // Get cart items and calculate the total amount
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);
            console.log(finalTotalAmount);
    
            // Create an order record
            const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, { session });
    
            // Reduce the stock for each product
            for (let item of items) {
               
                await db.collection("products").updateOne(
                    { _id: item.productID },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }
    
            // Clear the cart items after placing the order
            await db.collection("cartItems").deleteMany({ userID: new ObjectId(userId) }, { session });
    
            // Commit the transaction and close the session
            await session.commitTransaction();
            console.log('Transaction committed successfully');
            
        } catch (err) {
            console.log('Error occurred during placeOrder:', err);
    
            if (session) {
                await session.abortTransaction(); // Ensure the transaction is aborted if an error occurs
                console.log('Transaction aborted');
            }
    
            throw new ApplicationError(err.message || 'Order placement failed');
        } finally {
            if (session) {
                session.endSession(); // Ensure the session is always ended
                console.log('Session ended');
            }
        }
    }
    
    async getTotalAmount(userId,session) {
        const db = getDB();
    
        try {
            const items = await db.collection("cartItems").aggregate([
                {
                    $match: {
                        userID: new ObjectId(userId)
                    }
                },
                {    
                    $lookup: {
                        from: "products",
                        localField: "productID",
                        foreignField: "_id",
                        as: "productInfo"
                    }
                },
                {    
                    $unwind: "$productInfo"
                },
                {
                    $addFields: {
                        // Ensure `price` and `quantity` are treated as numbers
                        price: {
                            $convert: {
                                input: "$productInfo.price",
                                to: "double",
                                onError: 0,  // Default to 0 if conversion fails
                                onNull: 0    // Default to 0 if value is null
                            }
                        },
                        quantity: {
                            $convert: {
                                input: "$quantity",
                                to: "double",
                                onError: 0,  // Default to 0 if conversion fails
                                onNull: 0    // Default to 0 if value is null
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        // Calculate total amount after converting price and quantity
                        totalAmount: { $multiply: ["$price", "$quantity"] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$totalAmount" }
                    }
                }
            ],{session}).toArray();
    
            console.log(items);
    
            // Return the total amount if available
            return items;
        } catch (error) {
            console.error('Error calculating total amount:', error);
            throw error;
        }
    }
    
    
    
    // async getTotalAmount(userId){
    //     const db = getDB();

    //     const items = await db.collection("cartItems").aggregate([
    //         {
    //             $match: {
    //                 userID: new ObjectId(userId)
    //             }
    //         },
    //         {    
    //             $lookup:{
    //                 from:"products",
    //                 localField:"productID",
    //                 foreignField:"_id",
    //                 as:"productInfo"
    //             }
    //         },
    //         {    
    //             $unwind:"$productInfo",
    //         },          
    //         {
    //             $addFields:{
    //                 totalAmount: {
    //                     $multiply:["$productInfo.price", "$quantity"]
    //                 }
    //             }
    //         }
    //     ]).toArray();
    //     console.log(items)
    // }
}