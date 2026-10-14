/**
 * UI Module
 * Handles DOM rendering for product cards, category filters, cart drawer, and animations.
 */

import { getProductById, formatCurrency } from '../data/products.js';

// DOM element references
export const elements = {
  get search() { return document.getElementById('search'); },
  get sort() { return document.getElementById('sort'); },
  get cats() { return document.getElementById('cats'); },
  get grid() { return document.getElementById('grid'); },
  get none() { return document.getElementById('none'); },
  get count() { return document.getElementById('count'); },
  get openCart() { return document.getElementById('openCart'); },
  get closeCart() { return document.getElementById('closeCart'); },
  get drawer() { return document.getElementById('drawer'); },
  get overlay() { return document.getElementById('overlay'); },
  get items() { return document.getElementById('items'); },
  get sub() { return document.getElementById('sub'); },
  get ship() { return document.getElementById('ship'); },
  get total() { return document.getElementById('total'); },
  get checkout() { return document.getElementById('checkout'); },
  get modal() { return document.getElementById('modal'); },
  get formView() { return document.getElementById('formView'); },
  get doneView() { return document.getElementById('doneView'); },
  get fields() { return document.getElementById('fields'); },
  get cancel() { return document.getElementById('cancel'); },
  get place() { return document.getElementById('place'); },
  get again() { return document.getElementById('again'); },
  get orderMsg() { return document.getElementById('orderMsg'); }
};

/**
 * Creates HTML for a product image with an emoji fallback on image load error.
 * @param {object} product 
 * @param {string} cssClass 
 * @returns {string}
 */
export function createProductImageHTML(product, cssClass = "w-full h-full object-cover") {
  return `<img src="${product.image}" alt="${product.name}" loading="lazy" class="${cssClass}" onerror="this.outerHTML='<span class=&quot;text-5xl select-none&quot;>${product.emoji}</span>'">`;
}

/**
 * Renders category filter pills.
 * @param {string[]} categories 
 * @param {string} activeCategory 
 */
export function renderCategories(categories, activeCategory) {
  if (!elements.cats) return;
  elements.cats.innerHTML = categories
    .map(category => {
      const isActive = category === activeCategory;
      const activeClass = "bg-peach-500 text-white border-peach-500 shadow-sm";
      const inactiveClass = "border-peach-200 text-stone-700 hover:border-peach-400 bg-white";
      return `<button data-category="${category}" class="px-4 py-2 rounded-full text-sm font-medium border transition cursor-pointer ${isActive ? activeClass : inactiveClass}">${category}</button>`;
    })
    .join("");
}

/**
 * Renders the product grid.
 * @param {object[]} products 
 */
export function renderProductGrid(products) {
  if (!elements.grid || !elements.none) return;

  const hasProducts = products.length > 0;
  elements.none.classList.toggle('hidden', hasProducts);

  elements.grid.innerHTML = products
    .map((product, index) => {
      const discount = Math.round((1 - product.price / product.originalPrice) * 100);
      const delay = Math.min(index, 10) * 55;

      return `
        <div class="rounded-2xl bg-white border border-peach-100 p-4 flex flex-col card-in hover:shadow-lg transition" style="animation-delay: ${delay}ms">
          <div class="h-40 flex items-center justify-center overflow-hidden bg-peach-50 rounded-xl relative group">
            ${createProductImageHTML(product)}
          </div>
          <h3 class="font-semibold mt-3 text-sm text-stone-900 line-clamp-1">${product.name}</h3>
          <p class="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium">
            <span>&#9733;</span> ${product.rating.toFixed(1)}
          </p>
          <div class="mt-2 flex items-baseline gap-2 flex-wrap">
            <span class="text-base font-bold text-stone-900">${formatCurrency(product.price)}</span>
            <s class="text-xs text-slate-400">${formatCurrency(product.originalPrice)}</s>
            <span class="text-xs text-green-600 font-semibold">${discount}% off</span>
          </div>
          <button data-add="${product.id}" class="mt-3 w-full bg-peach-500 hover:bg-peach-600 active:bg-peach-700 text-white text-sm font-medium py-2 rounded-lg shadow-sm transition">
            Add to cart
          </button>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders the cart drawer content and updates totals.
 * @param {object} cart - { [productId]: quantity }
 * @param {object} totals - { subtotal, shipping, total, itemCount }
 * @param {string|null} lastAddedId 
 */
export function renderCartDrawer(cart, totals, lastAddedId = null) {
  const ids = Object.keys(cart);

  if (elements.count) {
    elements.count.textContent = totals.itemCount;
  }

  if (elements.items) {
    if (ids.length === 0) {
      elements.items.innerHTML = `<p class="text-center text-slate-500 py-10">Your cart is empty.</p>`;
    } else {
      elements.items.innerHTML = ids
        .map(id => {
          const product = getProductById(id);
          if (!product) return '';
          const isRecentlyAdded = String(id) === String(lastAddedId);

          return `
            <div class="${isRecentlyAdded ? 'item-in' : ''} flex items-center gap-3 border border-peach-100 rounded-xl p-3 bg-white">
              <div class="w-14 h-14 flex items-center justify-center overflow-hidden rounded-lg bg-peach-50 shrink-0">
                ${createProductImageHTML(product, "w-full h-full object-cover")}
              </div>
              <div class="flex-1 min-w-0 text-sm">
                <p class="font-semibold text-stone-800 truncate">${product.name}</p>
                <p class="text-peach-600 font-bold mt-0.5">${formatCurrency(product.price)}</p>
              </div>
              <div class="flex items-center gap-2">
                <button data-decrement="${id}" class="w-7 h-7 flex items-center justify-center rounded border border-peach-200 hover:bg-peach-50 text-stone-700 active:scale-95 transition" aria-label="Decrease quantity">-</button>
                <b class="w-5 text-center text-sm">${cart[id]}</b>
                <button data-increment="${id}" class="w-7 h-7 flex items-center justify-center rounded border border-peach-200 hover:bg-peach-50 text-stone-700 active:scale-95 transition" aria-label="Increase quantity">+</button>
              </div>
              <button data-remove="${id}" class="text-red-500 hover:text-red-700 text-xs font-medium ml-1 transition" aria-label="Remove item">Remove</button>
            </div>
          `;
        })
        .join("");
    }
  }

  if (elements.sub) elements.sub.textContent = formatCurrency(totals.subtotal);
  if (elements.ship) elements.ship.textContent = totals.shipping ? formatCurrency(totals.shipping) : "FREE";
  if (elements.total) elements.total.textContent = formatCurrency(totals.total);

  if (elements.checkout) {
    const isEmpty = ids.length === 0;
    elements.checkout.disabled = isEmpty;
    elements.checkout.classList.toggle('opacity-50', isEmpty);
    elements.checkout.classList.toggle('cursor-not-allowed', isEmpty);
  }
}

/**
 * Triggers a quick pop/bounce animation on a DOM element.
 * @param {HTMLElement} element 
 */
export function triggerBump(element) {
  if (!element) return;
  element.classList.remove('bump');
  void element.offsetWidth; // Force CSS reflow
  element.classList.add('bump');
}

/**
 * Smoothly animates a product thumbnail flying from the clicked button into the cart counter.
 * @param {HTMLElement} buttonElement 
 */
export function animateFlyToCart(buttonElement) {
  const countBadge = elements.count;
  const cartButton = elements.openCart;
  const card = buttonElement.closest('.card-in');
  const sourceImage = card && card.querySelector('img, span');

  if (!sourceImage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    triggerBump(countBadge);
    return;
  }

  const sourceRect = sourceImage.getBoundingClientRect();
  const targetRect = cartButton.getBoundingClientRect();
  const flyingClone = sourceImage.cloneNode(true);

  Object.assign(flyingClone.style, {
    position: 'fixed',
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    zIndex: '60',
    borderRadius: '16px',
    objectFit: 'cover',
    pointerEvents: 'none'
  });

  document.body.appendChild(flyingClone);

  const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  const animation = flyingClone.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.08)`, opacity: 0.5 }
    ],
    {
      duration: 700,
      easing: 'cubic-bezier(0.55, 0, 0.75, 0.2)'
    }
  );

  animation.onfinish = () => {
    flyingClone.remove();
    triggerBump(countBadge);
    triggerBump(cartButton);
  };
}

/**
 * Opens or closes the slide-over cart drawer and backdrop overlay.
 * @param {boolean} isOpen 
 */
export function toggleCartDrawer(isOpen) {
  if (elements.drawer) elements.drawer.classList.toggle('translate-x-full', !isOpen);
  if (elements.overlay) elements.overlay.classList.toggle('hidden', !isOpen);
}
