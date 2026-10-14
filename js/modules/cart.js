/**
 * Cart Module
 * Manages shopping cart state, localStorage synchronization, and price calculations.
 */

import { getProductById } from '../data/products.js';

const STORAGE_KEY = 'kartco-cart';
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

let cart = {};
let lastAddedId = null;

/**
 * Initializes and loads cart state from localStorage.
 */
export function initCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    cart = saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn('Unable to parse cart from localStorage:', error);
    cart = {};
  }
}

/**
 * Persists current cart state to localStorage.
 */
function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Unable to save cart to localStorage:', error);
  }
}

/**
 * Returns current cart state object { [productId]: quantity }.
 */
export function getCart() {
  return { ...cart };
}

/**
 * Returns the most recently added product ID for animation purposes.
 */
export function getLastAddedId() {
  return lastAddedId;
}

/**
 * Resets the last added product ID tracker.
 */
export function resetLastAddedId() {
  lastAddedId = null;
}

/**
 * Adds 1 unit of a product to the cart.
 * @param {number|string} productId 
 */
export function addToCart(productId) {
  const id = String(productId);
  cart[id] = (cart[id] || 0) + 1;
  lastAddedId = id;
  saveCart();
}

/**
 * Increments quantity of an existing item in the cart.
 * @param {number|string} productId 
 */
export function incrementQuantity(productId) {
  const id = String(productId);
  if (cart[id]) {
    cart[id]++;
    saveCart();
  }
}

/**
 * Decrements quantity of an existing item. Removes item if quantity reaches 0.
 * @param {number|string} productId 
 */
export function decrementQuantity(productId) {
  const id = String(productId);
  if (cart[id]) {
    cart[id]--;
    if (cart[id] <= 0) {
      delete cart[id];
    }
    saveCart();
  }
}

/**
 * Completely removes an item from the cart.
 * @param {number|string} productId 
 */
export function removeFromCart(productId) {
  const id = String(productId);
  delete cart[id];
  saveCart();
}

/**
 * Empties all items from the cart.
 */
export function clearCart() {
  cart = {};
  lastAddedId = null;
  saveCart();
}

/**
 * Calculates cart subtotal, shipping fee, grand total, and item count.
 * @returns {{ subtotal: number, shipping: number, total: number, itemCount: number }}
 */
export function calculateTotals() {
  let subtotal = 0;
  let itemCount = 0;

  for (const [id, quantity] of Object.entries(cart)) {
    const product = getProductById(id);
    if (product) {
      subtotal += product.price * quantity;
      itemCount += quantity;
    }
  }

  const shipping = (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return {
    subtotal,
    shipping,
    total,
    itemCount
  };
}

// Auto-initialize cart when module is loaded
initCart();
