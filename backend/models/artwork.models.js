import mongoose from 'mongoose';
const productSchema = mongoose.Schema({
    name:{
       type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    artist:{
       type:String,
        required:true
    }
},{
     timestamps:true //createdAt,updatedAt
});

const Product = mongoose.model('Product',productSchema);
export default Product;

// models/Product.js
// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     image: String
// });

// export default mongoose.model('Product', productSchema);



