import fs from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: Date.now().toString(),
      products: []
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) return null;

    const productIndex = carts[cartIndex].products.findIndex(
      p => p.product === pid
    );

    if (productIndex === -1) {
      carts[cartIndex].products.push({ product: pid, quantity: 1 });
    } else {
      carts[cartIndex].products[productIndex].quantity++;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return carts[cartIndex];
  }
}