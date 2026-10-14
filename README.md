# Easy Buy — Modular E-Commerce Store

**SaiKet Systems Internship — Task 2**

This project is a modularized, modern e-commerce web application featuring dynamic product filtering, sorting, a shopping cart with local storage persistence, interactive micro-animations (fly-to-cart, bump badge), and a complete checkout validation flow.

---

## 📁 Project Architecture & Modular Structure

```
intern2 project/
├── index.html                 # Clean semantic HTML entry point
├── package.json               # Project metadata & local dev server scripts
├── README.md                  # Project documentation & module guide
├── task2-easybuy.html         # Original single-file backup
├── css/
│   └── styles.css             # Micro-animations, transitions & custom styles
├── images/
│   ├── product-1.jpg          # Wireless Headphones
│   ├── product-2.jpg          # Smart Watch
│   ├── product-3.jpg          # Power Bank 10000mAh
│   ├── product-4.jpg          # Cotton T-Shirt
│   ├── product-5.jpg          # Running Shoes
│   ├── product-6.jpg          # Backpack 30L
│   ├── product-7.jpg          # Solar Street Light
│   └── product-8.jpg          # Ceramic Tea Cup Set
└── js/
    ├── app.js                 # Application entry point & event orchestrator
    ├── data/
    │   └── products.js        # Product catalog dataset & formatters
    └── modules/
        ├── cart.js            # Cart state management & localStorage persistence
        ├── ui.js              # DOM rendering, cart drawer & micro-animations
        └── checkout.js        # Checkout modal & form validation logic
```

---

## 🧩 Modules Breakdown

### 1. `css/styles.css`
Contains pure modular CSS for:
- `@keyframes rise`: Staggered card entrance animation.
- `@keyframes pop` / `.bump`: Micro-interaction bounce on button clicks and cart badge.
- `@keyframes slidein` / `.item-in`: Slide-in animation for newly added cart items.
- Focus outline rings and hover card elevation.
- `prefers-reduced-motion` accessibility support.

### 2. `images/`
Contains discrete, high-quality JPEG images extracted from previously embedded base64 strings, drastically reducing HTML/JS bundle size and improving maintainability.

### 3. `js/data/products.js`
- **`PRODUCTS`**: Array of catalog items with `id`, `name`, `category`, `price`, `originalPrice`, `rating`, `emoji` fallback, and `image` path.
- **`CATEGORIES`**: List of product categories (`["All", "Electronics", "Fashion", "Home"]`).
- **`getProductById(id)`**: Lookup helper to retrieve product records.
- **`formatCurrency(amount)`**: Formats numeric prices into Indian Rupees (`₹`, `en-IN`).

### 4. `js/modules/cart.js`
- **Cart State**: Managed in-memory and synchronized to browser `localStorage` (`kartco-cart`).
- **Operations**: `addToCart`, `incrementQuantity`, `decrementQuantity`, `removeFromCart`, `clearCart`.
- **Calculations**: Computes subtotal, free delivery threshold (free above ₹999, else ₹79), grand total, and total item count.
- **Animation Tracking**: Tracks `lastAddedId` to trigger slide-in entrance for the newest item.

### 5. `js/modules/ui.js`
- **`renderCategories`**: Renders dynamic category filter pills with active state styling.
- **`renderProductGrid`**: Renders product cards with calculated discount percentages, staggered animation delays, and image error fallbacks to emojis.
- **`renderCartDrawer`**: Updates cart items list, quantity steppers, subtotal, shipping, and grand total.
- **`animateFlyToCart`**: Web Animations API logic that creates a flying clone from the product card to the cart badge with cubic-bezier easing.
- **`triggerBump`**: Triggers badge bounce animation.
- **`toggleCartDrawer`**: Smooth slide-over drawer toggle with backdrop overlay.

### 6. `js/modules/checkout.js`
- **`CHECKOUT_FIELDS`**: Declarative configuration for form fields (name, email, 10-digit phone number, address, 6-digit pincode).
- **Validation**: Strict regex checks for email, phone format, address length, and pincodes with inline error feedback.
- **Modal Control**: Modal visibility management and order success summary message.

### 7. `js/app.js`
The central coordinator:
- Imports modules and coordinates application state (`activeCategory`, `searchQuery`, `sortOption`).
- Listens to search input, sort changes, category selections, cart actions, and checkout submission.
- Calls `init()` on page load to bootstrap the UI.

---

## 🚀 How to Run Locally

Because the project uses **native ES6 Modules** (`import` / `export`), it must be served through a local HTTP server:

### Option A: Using npm (Recommended)
```bash
npm start
```
*Or:*
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Using VS Code Live Server
Right-click on `index.html` in VS Code and select **"Open with Live Server"**.

### Option C: Using Python
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
