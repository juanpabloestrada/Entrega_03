import express from 'express';
import ProductModel from '../models/product.models.js';

import {uploader} from '../utilsMulter.js'; //Importamos el uploader previamente configurado

const router = express.Router();

//creación de un producto
router.post('/', async (req, res )=> {
    try{
        const newProduct = new ProductModel(req.body);
        console.log('Info del body: ', req.body);
        newProduct.thumbnail = req.file.path; //Agregamos la RUTA  de acceso a su respectivo archivo
        await newProduct.save();

        res.render('product', {product: newProduct.toObject()});   
        //Mongoose provides a method called toObject that transforms the document into a plain JavaScript object, 
        // copying all its own properties (including inherited ones) to the new object.
    } catch(error){
        return res.render('error', {error: 'Error al insertar producto'});
    }
});


//obtener un producto por id
//localhost:8080/product/:id
router.get('/:id', async (req, res) => {
    const { limit = 10, page = 1, sort, query} = req.query;
    try{
        
        //metodoFindById
        const unProducto = await ProductModel.findById(req.params.id);

        if(!unProducto){
            return res.render('error', {error: 'Producto no encontrado'});
        }
        res.render('product', {product: unProducto.toObject()});

    } catch(error){
        return res.render('error', {error: 'Error al buscar un producto'});
    };
});

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
  
    try {
      const searchQuery = query ? { $or: [{ category: query }, { available: query === 'true' }] } : {};
      const sortOrder = sort === 'desc' ? -1 : 1;
  
      const products = await Product.find(searchQuery)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort ? { price: sortOrder } : {});
  
      const totalProducts = await Product.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalProducts / limit);
  
      res.json({
        status: 'success',
        payload: products,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        page: parseInt(page),
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null,
        nextLink: page < totalPages ? `/products?page=${parseInt(page) + 1}&limit=${limit}` : null,
      });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

router.delete('/:id', async (req, res) => {
    try{
        const producto = await ProductModel.findByIdAndDelete(req.params.id);
        if(!producto){
            return res.render('error', {error: 'No se encontro el producto a eliminar'});
        }
        res.redirect('/product');
    }catch (error){
        return res.render('error', {error: 'Error al eliminar el producto'});
    }
})

router.get('/', async (req, res) => {
    try{
        const products = await ProductModel.find();

        //IF SI LA LISTA ESTA VACÍA

        res.render('products', { products : products.map( product => product.toObject() )})
    }catch (error){
        return res.render('error', {error: 'Error al obtener todos los productos'});
    }
});

router.get('/', async (req,res) => {
    try {
        const products = await ProductModel.find();
        res.render('products', { products : products.map(product => product.toObject() )})
    } catch (error) {
        return res.render('error', {error: 'Error al obtener todos los productos'})
    }
})

export default router;