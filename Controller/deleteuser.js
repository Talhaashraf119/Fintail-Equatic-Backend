import product from "../Model/product.js";


export const deleteuser=async(req,res)=>{
    const id=req.params.id
    const found=await product.findById(id)
    if(!found){
        res.send({message:"The User Are Not Found !"})


    }
 else{
    const result=await product.findByIdAndDelete(id)
   return res.status(200).send({Message:`The User ${id} is Deleted`,
    result})
 }
    

}