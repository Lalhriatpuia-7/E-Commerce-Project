import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose, { mongo } from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product', productSchema);
const ReviewtModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema)

export default class ProductRepository{
    constructor(){
        this.collection = "products";
    }

    async add(productData){
        try{
            // 1. Adding Product
            console.log(productData);
            productData.categories=productData.category.split(',').map(e=>e.trim());
            console.log(productData);
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();

            // 2. Update categories.
            await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {$push: {products: new ObjectId(savedProduct._id)}}
            )
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }
    // async add(newProduct){

    //     try{
    //         //get db
    //         const db = getDB();
    //         const collection = db.collection(this.collection);

    //         await collection.insertOne(newProduct);

    //         return newProduct;

    //     }
    //     catch(err){
    //         console.log(err);
    //         throw new ApplicationError("something went wrong with database", 500);
    //     }

    // }

    async getAll(){
        try{
            //get db
            const db = getDB();
            const collection = db.collection(this.collection);

            const products = await collection.find().toArray();
            console.log(products);
            return products;

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }

    }
    async get(id){
        try{
            //get db
            const db = getDB();
            const collection = db.collection(this.collection);

            const products = collection.findOne({_id:new ObjectId(id)});

            return products;

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }
    }
    async filter(minPrice,maxPrice, category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);

            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte:parseFloat(minPrice)};
            }
            if(maxPrice){
                
                filterExpression.price = {...filterExpression.price,$lte:parseFloat(maxPrice)};
            }
            if(category){
                filterExpression.category = category;
            }
            // if(categories){
            //     filterExpression = {$or:[{category:{$in:categories}}, filterExpression]}
            // }
            // return collection.find(filterExpression).toArray();
            // return collection.find(filterExpression).project({name:1,price:1, _id:0,ratings:1}).toArray();
            // return collection.find(filterExpression).project({name:1,price:1, _id:0,ratings:{$slice:1}}).toArray();
            return collection.find(filterExpression).project({name:1,price:1, _id:0,ratings:{$slice:-1}}).toArray();
        }catch(err){
            throw new ApplicationError("something went wrong with database", 500);
        }
    }
    async rateProduct(userID,productID,rating){
        try{

            const productToUpdate = await ProductModel.findById(productID);
            if(!productToUpdate){
                throw new Error("Product not found");
            }
            console.log(productToUpdate);
            const userReview = await ReviewtModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
            console.log(userReview);
            if(userReview){
                userReview.rating=rating;
                await userReview.save();
            }else{
                const newReview = new ReviewtModel({
                    product: new ObjectId(productID),
                    user: new ObjectId(userID),
                    rating: rating
                })
                newReview.save();
            }
        //     const db = getDB();
        //     const collection = db.collection(this.collection);
        //     //Remove existing entry
        //     await collection.updateOne({
        //         _id: new ObjectId(productID)
        //     },
        // {
        //     $pull:{ratings:{userID:new ObjectId(userID)}}
        // })
        //     // add new entry
        //     await collection.updateOne({
        //         _id:new ObjectId(productID)
        //     },{
        //         $push:{ratings:{userID:new ObjectId(userID),rating}}
        //     })

        }catch(err){
            throw new ApplicationError("something went wrong with database", 500);
        }
    }
    // async rateProduct(userID,productID,rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         //find product
    //         const product = await collection.findOne({_id:new ObjectId(productID)});
    //         console.log(product)
    //         //find rating
    //         const userRating = product?.ratings?.find((r)=>{
    //             console.log(r.userID.toString(),userID);    
    //            return (r.userID.toString())==userID
    //         });
    //        console.log(userRating);
    //         if(userRating){
    //         //update the rating
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID),"ratings.userID": new ObjectId(userID)
    //             },{
    //                 $set:{
    //                     "ratings.$.rating":rating
    //                 }
    //             }) 
    //         }else{

    //         await collection.updateOne({
    //             _id:new ObjectId(productID)
    //         },{
    //             $push:{ratings:{userID:new ObjectId(userID),rating}}
    //         })
    //     }

    //     }catch(err){
    //         throw new ApplicationError("something went wrong with database", 500);
    //     }
    // }
//aggregation pipeline
    async averageProductPricePerCategory(){
        try{
        const db = getDB();
        const result = await db.collection(this.collection).aggregate([
            {
                //stage1: Get average price per category
                $group:{
                    _id:"$category",
                    averagePrice: {$avg:"$price"}
                }
            }
        ]).toArray();

        return result;
        }catch(err){
            throw new ApplicationError("something went wrong with database", 500);
        }

    }

}
