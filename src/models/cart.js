import mongoose from "mongoose";
import ProductModel from "./product.models";
const cartSchema = new mongoose.Schema({
    ProductModel: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: { type: Number, default: 1},
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;