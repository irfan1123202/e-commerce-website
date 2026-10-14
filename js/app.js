/**
 * Main Application Module
 * Orchestrates application lifecycle, event listeners, and data flow across modules.
 */

import { PRODUCTS, CATEGORIES, formatCurrency } from './data/products.js';
import {
  getCart,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  calculateTotals,
  getLastAddedId,
  resetLastAddedId
} from './modules/cart.js';
import {
  elements,
  renderCategories,
  renderProductGrid,
  renderCartDrawer,
  triggerBump,
  animateFlyToCart,
  toggleCartDrawer
} from './modules/ui.js';
import {
  renderCheckoutFields,
  openCheckoutModal,
  closeCheckoutModal,
  processOrder
} from './modules/checkout.js';

// Application State
let activeCategory = 'All';
let searchQuery = '';
let sortOption = '';

/**
 * Filters and sorts products based on active filters.
 * @returns {object[]}
 */
function getFilteredProducts() {
  let list = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (sortOption === 'asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'rate') {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

/**
 * Re-renders the product grid based on updated state.
 */
function updateProductsView() {
  const filtered = getFilteredProducts();
  renderProductGrid(filtered);
}

/**
 * Re-renders the cart drawer, badge count, and financial totals.
 */
function updateCartView() {
  const cart = getCart();
  const totals = calculateTotals();
  const lastAddedId = getLastAddedId();
  renderCartDrawer(cart, totals, lastAddedId);
  resetLastAddedId();
}

/**
 * Registers all global and scoped event listeners.
 */
function setupEventListeners() {
  // Global delegated click handler for products, categories, and cart items
  document.addEventListener('click', event => {
    const target = event.target;

    // Category button click
    if (target.dataset.category) {
      activeCategory = target.dataset.category;
      renderCategories(CATEGORIES, activeCategory);
      updateProductsView();
      return;
    }

    // Add to cart button click
    if (target.dataset.add) {
      const productId = target.dataset.add;
      addToCart(productId);
      animateFlyToCart(target);
      updateCartView();
      triggerBump(target);

      target.textContent = 'Added ✓';
      setTimeout(() => {
        target.textContent = 'Add to cart';
      }, 900);
      return;
    }

    // Increment quantity button click in cart
    if (target.dataset.increment) {
      incrementQuantity(target.dataset.increment);
      updateCartView();
      return;
    }

    // Decrement quantity button click in cart
    if (target.dataset.decrement) {
      decrementQuantity(target.dataset.decrement);
      updateCartView();
      return;
    }

    // Remove item button click in cart
    if (target.dataset.remove) {
      removeFromCart(target.dataset.remove);
      updateCartView();
      return;
    }
  });

  // Search input handler with instant filtering
  if (elements.search) {
    elements.search.addEventListener('input', event => {
      searchQuery = event.target.value.toLowerCase().trim();
      updateProductsView();
    });
  }

  // Sort dropdown change handler
  if (elements.sort) {
    elements.sort.addEventListener('change', event => {
      sortOption = event.target.value;
      updateProductsView();
    });
  }

  // Cart Drawer open and close handlers
  if (elements.openCart) {
    elements.openCart.addEventListener('click', () => toggleCartDrawer(true));
  }
  if (elements.closeCart) {
    elements.closeCart.addEventListener('click', () => toggleCartDrawer(false));
  }
  if (elements.overlay) {
    elements.overlay.addEventListener('click', () => toggleCartDrawer(false));
  }

  // Checkout modal openers and closers
  if (elements.checkout) {
    elements.checkout.addEventListener('click', openCheckoutModal);
  }
  if (elements.cancel) {
    elements.cancel.addEventListener('click', closeCheckoutModal);
  }
  if (elements.again) {
    elements.again.addEventListener('click', closeCheckoutModal);
  }

  // Place order action
  if (elements.place) {
    elements.place.addEventListener('click', () => {
      const totals = calculateTotals();
      processOrder(formatCurrency(totals.total), () => {
        clearCart();
        updateCartView();
      });
    });
  }
}

/**
 * Initializes the entire application.
 */
export function init() {
  renderCategories(CATEGORIES, activeCategory);
  updateProductsView();
  updateCartView();
  renderCheckoutFields();
  setupEventListeners();
}

// Kick off app when DOM content is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
