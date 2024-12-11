import jwt from 'jsonwebtoken';
const jwtAuth = (req,res,next)=>{

    //read the token

    const token = req.headers['authorization'];

    //if no token return error
    if(!token){
        return res.status(401).send('Unauthorized');
    }
    //chcek of token is valid
    try{
    const payload = jwt.verify(token,process.env.JWT_SECRET);
    req.userID = payload.userID;
   

    } catch(err){
        //return error
        return res.status(401).send('Unauthorized');
    }
    //call next middleware
    next();

}
export default jwtAuth;