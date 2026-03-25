import user from "../Model/model.js"

export const update=async(req,res)=>{
    const id=req.params.id
    const update=req.body
if(req.file){
    update.imagepath=req.file.path
}
    
    try {
        const result=await user.findByIdAndUpdate(id,update,{new:true})
        res.status(200).send({message:"The User are Upadated Successfully",
            result
        })
        
    } catch (error) {
        res.status(404).send({message:"Error in Updation "})
        
    }
}