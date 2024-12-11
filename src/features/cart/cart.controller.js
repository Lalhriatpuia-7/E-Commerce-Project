import CartItemModel from "./cart.model.js";
import CartItemRepository from "./cartItems.repository.js";

export default class CartItemsController{
    constructor(){
        this.cartItemRepository = new CartItemRepository();
    }
    async add(req,res){
        try{
        const {productID, quantity} = req.body;
        const userID = req.userID;
        
        await this.cartItemRepository.add(productID,userID,quantity);
        res.status(201).send('cart is updated')
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong");
        }
    }
    async get(req,res){
    try{
        const userID = req.userID;
        const items = await this.cartItemRepository.get(userID);
        return res.status(200).send(items);
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
    }
    async delete(req,res){
        try{
        const userID = req.userID;
        const productID = req.params.id;
        const isDeleted = await this.cartItemRepository.delete(userID,productID);
        if(!isDeleted){
            return res.status(404).send("item not found");
        }
        return res.status(200).send("Cart item is removed")
    }catch(err){
        console.log(err);
        
    }
    }
}