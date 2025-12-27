import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json");

/* PRODUCTS */
app.get("/api/products", async (req, res) => {
  res.json(await productManager.getProducts());
});

app.get("/api/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

app.post("/api/products", async (req, res) => {
  const product = await productManager.addProduct(req.body);
  res.json(product);
});

app.put("/api/products/:pid", async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: "Producto no encontrado" });
});

app.delete("/api/products/:pid", async (req, res) => {
  await productManager.deleteProduct(req.params.pid);
  res.json({ message: "Producto eliminado" });
});

/* CARTS */
app.post("/api/carts", async (req, res) => {
  const cart = await cartManager.createCart();
  res.json(cart);
});

app.get("/api/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: "Carrito no encontrado" });
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
});

app.listen(8080, () => {
  console.log("Servidor escuchando en puerto 8080");
});