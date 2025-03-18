import Booking from '../models/bookings.models.js';
import mongoose from 'mongoose';

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.log("Error in fetching bookings:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createBooking = async (req, res) => {
    const booking = req.body;
    if (!booking.fullName || !booking.email || !booking.exhibitionName || !booking.exhibitionDate) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    
    const newBooking = new Booking(booking);
    try {
        await newBooking.save();
        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        console.error("Error in Create booking:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateBooking = async (req, res) => {
    const { id } = req.params;
    const booking = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Booking ID" });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, booking, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteBooking = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Booking ID" });
    }
    try {
        await Booking.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Booking deleted" });
    } catch (error) {
        console.log("Error in deleting booking:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
