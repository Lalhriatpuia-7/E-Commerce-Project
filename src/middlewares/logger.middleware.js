import fs from 'fs';
import winston from 'winston';
// const fsPromise = fs.promises;

export const logger = winston.createLogger({
    level:'info',
    format: winston.format.json(),
    defaultMeta: {service: 'request-logging'},
    transports:[
        new winston.transports.File({filename: 'logs.txt'})
    ],
    
});

 const loggerMiddleware = async (req,res,next)=>{
    //log request body
    try{
    if(!req.url.includes('signIn')){    
    const logData = `${req.url}-${JSON.stringify(req.body)}`
    
   logger.info(logData)}
    }catch(err){
        console.log(err);
    }
//    logger.on('finish',callback);
//    await log(logData);
    
   next();
}
// async function log(logData){
//    try{
//         logData = `\n ${new Date().toString()}-${logData}`;
//         await fsPromise.appendFile("log.txt",logData);
//     }catch(err){
//         console.log(err);
//     }
// }
export default loggerMiddleware;