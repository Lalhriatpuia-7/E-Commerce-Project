import "./env.js";
import express from 'express';
import swagger from 'swagger-ui-express';

import productRouter from './src/features/product/product.routes.js';
import bodyParser from 'body-parser';
import userRouter from './src/features/user/user.router.js';
import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cart.route.js';
import cors from 'cors';
import apiDocs from './swagger.json' with {type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import {logger} from './src/middlewares/logger.middleware.js'
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.router.js";


const server = express();


//CORS policy config
var corsOptions ={
    orgin:'http://localhost:5500',

}

server.use(cors(corsOptions));

// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Orgin','http://localhost:5500');// use * for allowing all clients
//     res.header('Access-Control-Allow-Headers','*');// use * for allowing all clients
//     res.header('Access-Control-Allow-Methods','*');// use * for allowing all clients

//     //return ok for preflight request
//     if(req.method =="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

server.use(bodyParser.json());
//swagger path
server.use("/api-docs", swagger.serve,swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use('/api/orders', jwtAuth, orderRouter);
server.get('/', (req,res)=>{
    res.send("welcome to Ecommerce APIs");
});

server.use('/api/products', jwtAuth, productRouter);
server.use('/api/users', userRouter);
server.use('/api/cart', jwtAuth,cartRouter);
server.use('/api/likes', jwtAuth, likeRouter);
//Error handler Middleware
server.use((err,req,res,next)=>{
    console.log(err);
    logger.info(err);

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }

    //server errors
    res.status(500).send("Something went wrong, please try again later")
    });
//handle 404 not found paths
server.use((req,res)=>{
    res.status(404).send("API not found. Please check our documentation for more information at localhost:3200/api-docs")
})

server.listen(3200,()=>{
    console.log("Server is running at 3200");
    // connectToMongoDB();
    connectUsingMongoose();
});

