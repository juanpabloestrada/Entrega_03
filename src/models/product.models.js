import mongoose from "mongoose";
const {Schema} = mongoose;

// Definimos el esquema para el producto
const productSchema = new Schema({
    nombre: {type: String, required: true, minlength: 3},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true},
    thumbnail: {type: String}
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;