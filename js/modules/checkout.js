/**
 * Checkout Module
 * Handles delivery details form rendering, field validation, and order placement.
 */

import { elements, toggleCartDrawer } from './ui.js';

export const CHECKOUT_FIELDS = [
  {
    id: 'name',
    label: 'Full name',
    type: 'text',
    placeholder: 'e.g. John Doe',
    validate: (val) => val.trim().length >= 3 || 'Enter your full name'
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'name@example.com',
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val) || 'Enter a valid email address'
  },
  {
    id: 'phone',
    label: 'Phone (10 digits)',
    type: 'tel',
    placeholder: '10-digit mobile number',
    validate: (val) => /^[6-9]\d{9}$/.test(val.trim()) || 'Enter a valid 10-digit mobile number starting with 6-9'
  },
  {
    id: 'addr',
    label: 'Address',
    type: 'text',
    placeholder: 'House no, Street, Landmark',
    validate: (val) => val.trim().length >= 8 || 'Enter a complete address (min 8 characters)'
  },
  {
    id: 'pin',
    label: 'Pincode',
    type: 'text',
    placeholder: '6-digit pincode',
    validate: (val) => /^\d{6}$/.test(val.trim()) || 'Pincode must be exactly 6 digits'
  }
];

/**
 * Dynamically renders the checkout form fields and validation error placeholders.
 */
export function renderCheckoutFields() {
  if (!elements.fields) return;

  elements.fields.innerHTML = CHECKOUT_FIELDS
    .map(field => `
      <div>
        <label for="f_${field.id}" class="block mb-1 font-medium text-stone-700">${field.label}</label>
        <input 
          id="f_${field.id}" 
          type="${field.type}" 
          placeholder="${field.placeholder}"
          class="w-full rounded-lg border border-peach-200 bg-transparent px-3 py-2 text-stone-900 focus:outline-none focus:border-peach-500 focus:ring-2 focus:ring-peach-200 transition"
        >
        <p id="e_${field.id}" class="text-red-500 text-xs mt-1 min-h-[1rem]"></p>
      </div>
    `)
    .join('');
}

/**
 * Opens the checkout modal and closes the cart drawer.
 */
export function openCheckoutModal() {
  toggleCartDrawer(false);
  if (elements.formView) elements.formView.classList.remove('hidden');
  if (elements.doneView) elements.doneView.classList.add('hidden');
  if (elements.modal) elements.modal.classList.remove('hidden');
}

/**
 * Closes the checkout modal.
 */
export function closeCheckoutModal() {
  if (elements.modal) elements.modal.classList.add('hidden');
}

/**
 * Validates all fields in the checkout form.
 * @returns {{ isValid: boolean, values: object }}
 */
export function validateForm() {
  let isValid = true;
  const values = {};

  CHECKOUT_FIELDS.forEach(field => {
    const input = document.getElementById(`f_${field.id}`);
    const error = document.getElementById(`e_${field.id}`);
    const val = input ? input.value : '';
    values[field.id] = val;

    const result = field.validate(val);
    if (error) {
      error.textContent = result === true ? '' : result;
    }

    if (result !== true) {
      isValid = false;
      if (input) input.classList.add('border-red-400');
    } else {
      if (input) input.classList.remove('border-red-400');
    }
  });

  return { isValid, values };
}

/**
 * Submits the order if form fields are valid.
 * @param {string} formattedTotal 
 * @param {Function} onOrderSuccess 
 */
export function processOrder(formattedTotal, onOrderSuccess) {
  const { isValid, values } = validateForm();
  if (!isValid) return false;

  if (elements.orderMsg) {
    elements.orderMsg.textContent = `Thanks ${values.name.trim()}! Order total ${formattedTotal}. Confirmation will be sent to ${values.email.trim()}.`;
  }

  // Clear inputs
  CHECKOUT_FIELDS.forEach(field => {
    const input = document.getElementById(`f_${field.id}`);
    const error = document.getElementById(`e_${field.id}`);
    if (input) {
      input.value = '';
      input.classList.remove('border-red-400');
    }
    if (error) error.textContent = '';
  });

  // Switch to success view
  if (elements.formView) elements.formView.classList.add('hidden');
  if (elements.doneView) elements.doneView.classList.remove('hidden');

  if (typeof onOrderSuccess === 'function') {
    onOrderSuccess();
  }

  return true;
}
