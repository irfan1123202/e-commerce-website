/**
 * Product catalog dataset and formatting utilities.
 */

export const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 3499,
    originalPrice: 4990,
    rating: 4.4,
    emoji: "&#127911;", // 🎧
    image: "images/product-1.jpg"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 2999,
    originalPrice: 4999,
    rating: 4.2,
    emoji: "&#8986;", // ⌚
    image: "images/product-2.jpg"
  },
  {
    id: 3,
    name: "Power Bank 10000mAh",
    category: "Electronics",
    price: 899,
    originalPrice: 1299,
    rating: 4.5,
    emoji: "&#128267;", // 🔋
    image: "images/product-3.jpg"
  },
  {
    id: 4,
    name: "Cotton T-Shirt",
    category: "Fashion",
    price: 399,
    originalPrice: 699,
    rating: 4.1,
    emoji: "&#128085;", // 👕
    image: "images/product-4.jpg"
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Fashion",
    price: 1799,
    originalPrice: 2999,
    rating: 4.6,
    emoji: "&#128095;", // 👟
    image: "images/product-5.jpg"
  },
  {
    id: 6,
    name: "Backpack 30L",
    category: "Fashion",
    price: 1099,
    originalPrice: 1799,
    rating: 4.3,
    emoji: "&#127890;", // 🎒
    image: "images/product-6.jpg"
  },
  {
    id: 7,
    name: "Solar Street Light",
    category: "Home",
    price: 1299,
    originalPrice: 1999,
    rating: 4.0,
    emoji: "&#128161;", // 💡
    image: "images/product-7.jpg"
  },
  {
    id: 8,
    name: "Ceramic Tea Cup Set",
    category: "Home",
    price: 499,
    originalPrice: 799,
    rating: 4.4,
    emoji: "&#9749;", // ☕
    image: "images/product-8.jpg"
  }
];

export const CATEGORIES = ["All", "Electronics", "Fashion", "Home"];

/**
 * Finds a product by its unique ID.
 * @param {number|string} id 
 * @returns {object|undefined}
 */
export function getProductById(id) {
  return PRODUCTS.find(product => String(product.id) === String(id));
}

/**
 * Formats a numeric price into INR currency string (e.g., ₹3,499).
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}
