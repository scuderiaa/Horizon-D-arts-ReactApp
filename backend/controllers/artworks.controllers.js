import Product from '../models/artwork.models.js';
import mongoose from 'mongoose';
export const getproducts = async (req,res)=> {
    try {
        const products = await Product.find({});
        res.status(200).json({success:true,data:products});
    } catch (error) {
        console.log("error in fetching products:",error.message);
        res.status(500).json({success:false,message:"server Error"});
    }
};

export const createProduct = async (req,res) => {
    const product = req.body;// user will send this data
    if(!product.name || !product.price || !product.image || !product.artist ){
        return res.status(400).json({success:false,message:"please provide all fields" });
    }
    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({success: true,data:newProduct});
    } catch (error) {
        console.error("Error in Create product:",error.message);
        res.status(500).json({success:false,message:"server Error"});
    }
};

export const updateProducts = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error)  {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProduct = async (req,res) =>{
    const {id} = req.params;
    // console.log("id:",id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"Product deleted"});

    } catch (error) {
        console.log("error in dedleting product:",error.message);
        res.status(500).json({success:false,message:"server Error"});
    }
};