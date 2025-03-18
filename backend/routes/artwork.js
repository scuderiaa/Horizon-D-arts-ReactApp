import express from "express";
import Product from '../models/artwork.models.js'
import mongoose from 'mongoose';
import{ createProduct,deleteProduct,getproducts,updateProducts } from '../controllers/artworks.controllers.js';
const router = express.Router();
router.get("/",getproducts);
router.post("/",createProduct);

// app.put("/api/products/:id",async (req,res)=>{
//     const {id} = req.params;
//     const product = req.body;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         // Handle invalid ObjectId
//         return res.status(404).json({success:false,message:"Invalid Product Id"});
//     }
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(id,Product,{new:true});
//         res.status(200).json({success: true,data: updatedProduct})
//     } catch (error) {
//         res.status(500).json({ success:false,message:"server Error"});
//     }
// });
router.put("/:id",updateProducts);


router.delete("/:id",deleteProduct);
export default router;