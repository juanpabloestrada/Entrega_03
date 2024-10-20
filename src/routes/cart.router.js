import express from 'express';
import Cart from '../models/cart.js';

import {uploader} from '../utilsMulter.js';

const router = express.Router();

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const cart = await Cart.findById(cid);
      cart.products = cart.products.filter(product => product.product.toString() !== pid);
      await cart.save();
      res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });
  
  // PUT /api/carts/:cid - Actualizar todo el carrito con un nuevo arreglo de productos
  router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
      const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
      res.json({ status: 'success', payload: cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });
  
  // PUT /api/carts/:cid/products/:pid - Actualizar la cantidad de un producto específico
  router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const cart = await Cart.findById(cid);
      const product = cart.products.find(p => p.product.toString() === pid);
      if (product) {
        product.quantity = quantity;
        await cart.save();
        res.json({ status: 'success', payload: cart });
      } else {
        res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
      }
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });
  
  // DELETE /api/carts/:cid - Eliminar todos los productos del carrito
  router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
  
    try {
      const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
      res.json({ status: 'success', message: 'Carrito vacío', payload: cart });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });
  
  export default router;