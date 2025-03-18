import express from 'express';
import Exhibition from '../models/exhibition.models.js'
import mongoose from 'mongoose';
import {createExhibition,deleteExhibition,getExhibition,updateExhibition} from '../controllers/exhibition.controllers.js';
const router = express.Router();
router.get("/",getExhibition);
router.post("/",createExhibition);
router.put("/:id",updateExhibition);
router.delete("/:id",deleteExhibition);
    export default router;

