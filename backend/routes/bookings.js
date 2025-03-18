import express from "express";
import { createBooking, deleteBooking, getBookings, updateBooking } from '../controllers/bookings.controllers.js';

const router = express.Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;