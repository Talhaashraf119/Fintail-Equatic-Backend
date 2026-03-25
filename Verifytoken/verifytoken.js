import jwt from "jsonwebtoken"

export const verifytoken=(req,res,next)=>{
const token =req.header("Authorization")

if(!token){
    res.send("Access Denied")
}

try {
    const decode=jwt.verify(token,process.env.SECRET_KEY)
    req.user=decode
    next();
    
} catch (error) {
    res.status(400).send({ message: "Invalid Token" });
}

}
//hello dunya kiya hal ah a