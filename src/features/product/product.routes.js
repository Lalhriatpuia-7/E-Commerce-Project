import express from 'express';
import ProductController from './controllers/product.controller.js';
import {upload} from '../../middlewares/fileUpload.middleware.js';

const productRouter = express.Router(); 

const productController = new ProductController();

productRouter.get('/filter', (req,res)=>{
    productController.filterProducts(req,res);
});
productRouter.get('/', (req,res)=>{
    productController.getAllProducts(req,res);
});
productRouter.post('/',upload.single('imageUrl'),(req,res)=>{
    productController.addProduct(req,res);
});
productRouter.get("/averagePrice", (req,res)=>{
    productController.averagePrice(req,res);
})
productRouter.get('/:id', (req,res)=>{
    productController.getOneProduct(req,res);
});
productRouter.post('/rate', (req,res,next)=>{
    productController.rateProduct(req,res,next);
});




export default productRouter;