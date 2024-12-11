//productID userID quantity

export default class CartItemModel{
    constructor(productID, userID, quantity, id){
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;

    }
    static add(productID,userID, quantity){
        
        const cartItem = new CartItemModel(productID, userID,quantity);

        cartItem.id = cartItems.length + 1;
        cartItems.push(cartItem);
        return cartItem;
    }
    static get(userID){
        return cartItems.filter(c=>c.userID == userID);
    }
    static delete(cartItemID,userID){
        const cartItem = cartItems.findIndex(c=> c.id==cartItemID && c.userID == userID);

        if(cartItem==-1){
            return "item not found";
        }else{
            cartItems.splice(cartItem,1);
            
        }
    }
}

var cartItems = [
new CartItemModel(1,2,1,1),
new CartItemModel(1,1,2,2),

]