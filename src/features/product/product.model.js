import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "../user/user.model.js";

export default class ProductModel{
    constructor(name,description,price,sizes,imageUrl,category,id){
        this._id=id;
        this.name=name;
        this.description=description;
        this.imageUrl=imageUrl;
        this.category=category;
        this.price=price;
        this.sizes=sizes;
    }

    static add(product){
        product.id = products.length+1;
        products.push(product);
        return product;
    }
    static getAll(){
        return products;
    }

    static getProduct(id){
      const product = products.find(product => product.id == id);
      return product;
    }

    static filterProducts(minPrice,maxPrice,category){
     
      const result = products.filter((product) => {
      
       return (
        
        (!minPrice || product.price >= minPrice) && 
       (!maxPrice || product.price <= maxPrice) &&
       (!category || product.category == category)
      );
    });
    console.log(result);
      return result;
    }
    static rateProduct(userID,productID,rating){
      // validation user - product
      const user = UserModel.getAll().find(u=> u.id == userID);
      if(!user){
        throw new ApplicationError("user not found",404);
      }

      const product = products.find(p=> p.id==productID);
      if(!product){
        throw new ApplicationError("product not found",400);
      }

      //check if there is any rating if not add rating array

      if(!product.ratings){
        product.ratings = [];
        product.ratings.push({
          userID:userID,
          rating:rating,
        })
      }else{
        const existingRating = product.ratings.findIndex((r)=> r.userID==userID)
        if(existingRating >= 0){
          product.ratings[existingRating]  = {
            userID: userID,
            rating:rating,
          } 
        }else{
          product.ratings.push({
            userID:userID,
            rating:rating,

          })
        }
      }
      
    }
} 

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Cateogory1'
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Cateogory2',
      ['M', 'XL']
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Cateogory3',
      ['M', 'XL','S']
    )];

  