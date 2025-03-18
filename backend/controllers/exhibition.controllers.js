import Exhibition from '../models/exhibition.models.js';
import mongoose from 'mongoose';
export const getExhibition = async (req,res)=> {
    try {
        const exhibition= await Exhibition.find({});
        res.status(200).json({success:true,data:exhibition});
    } catch (error) {
        console.log("error in fetching exhibition:",error.message);
        res.status(500).json({success:false,message:"server Error"});
    }
};

export const createExhibition = async (req,res) => {
    const exhibition = req.body;
    if(!exhibition.name || !exhibition.lieu || !exhibition.image || !exhibition.date || !exhibition.hours || exhibition.price === undefined){
        return res.status(400).json({success:false,message:"please provide all fields" });
    }
    const newExhibition = new Exhibition(exhibition);
    try {
        await newExhibition.save();
        res.status(201).json({success: true,data:newExhibition});
    } catch (error) {
        console.error("Error in Creating exhibition:",error.message);
        res.status(500).json({success:false,message:"server Error"});
    }
};


export const updateExhibition = async (req, res) => {
    const { id } = req.params;
    const exhibition = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Exhibition ID" });
    }

    try {
        const updatedExhibition = await Exhibition.findByIdAndUpdate(id, exhibition, { new: true });

        if (!updatedExhibition) {
            return res.status(404).json({ success: false, message: "exhibition not found" });
        }

        res.status(200).json({ success: true, data: updatedExhibition });
    } catch (error)  {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteExhibition = async (req,res) =>{
    const {id} = req.params;
    // console.log("id:",id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid User ID" });
    }
    try {
        await Exhibition.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"Exihibition deleted"});

    } catch (error) {
        console.log("error in deleting exhibition:",error.message);
        res.status(500).json({success:false,message:"server Error"});
    }
};