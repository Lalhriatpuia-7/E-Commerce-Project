import {UserModel} from '../features/user/user.model.js'
const basicAuthorizer = (req,res,next)=>{
//check of authorization header is empty

const authHeader = req.headers["authorization"];

if(!authHeader){
    return res.status(401).send("No Authorization details found");
}
console.log(authHeader);
//extract credentials [Basic qaerug876598ggerg]
const base64Credentials = authHeader.replace('Basic ','');
console.log(base64Credentials);
//decode credentials
const decodeCreds = Buffer.from(base64Credentials, 'base64').toString('utf8');
console.log(decodeCreds);

const creds = decodeCreds.split(':');

const user = UserModel.getAll().find(u=> u.email==creds[0] && u.password == creds[1]);

if(user){
    next();
}else{
    return res.status(401).send('Incorrect Credentials');
}

}
export default basicAuthorizer;