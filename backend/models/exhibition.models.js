import mongoose from 'mongoose';
const exhibitionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lieu: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    hours: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0  // Set default to 0 for free exhibitions
    }
}, {
    timestamps: true
});


const Exhibition = mongoose.model('Exhibition',exhibitionSchema);
export default Exhibition;

// models/Product.js
// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     image: String
// });

// export default mongoose.model('Product', productSchema);



