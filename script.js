const products = [
  { id: 1, name: 'Tie-Dye Lounge Set', price: 150, image: 'assets/1.jpg' },
  { id: 2, name: 'Sunburst Tracksuit', price: 150, image: 'assets/2.jpg' },
  { id: 3, name: 'Retro Red Streetwear', price: 150, image: 'assets/3.jpg' },
  { id: 4, name: 'Urban Sportwear Combo', price: 150, image: 'assets/4.jpg' },
  { id: 5, name: 'Oversized Knit & Coat', price: 150, image: 'assets/5.jpg' },
  { id: 6, name: 'Chic Monochrome Blazer', price: 150, image: 'assets/6.jpg' }
];

const selected = new Map();

function renderProducts() {
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = '';
  products.forEach((product) => {
    const isAdded = selected.has(product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="price-text">$${product.price.toFixed(2)}</p>
      <button class="toggle-btn ${isAdded ? 'added' : ''}" data-id="${product.id}">
        <div class="addbtntext">
          <span class="label">${isAdded ? 'Added to Bundle' : 'Add to Bundle'}</span>
          <span class="icon">${isAdded ? '✓' : '+'}</span>
        </div>
      </button>
    `;
    grid.appendChild(card);
  });
}

function updateSidebar() {
  const container = document.getElementById('selected-products');
  const subtotalText = document.getElementById('subtotal');
  const discountText = document.getElementById('discount');
  const ctaBtn = document.getElementById('add-to-cart');

  container.innerHTML = '';
  let subtotal = 0;

  selected.forEach(({ product, quantity }) => {
    subtotal += product.price * quantity;
    const item = document.createElement('div');
    item.className = 'selected-item';
    item.innerHTML = `
      <img src="${product.image}" />
      <div class="selected-info">
        <span>${product.name}</span>
        <div class="stepper" data-id="${product.id}">
          <button class="decrease">-</button>
          <span>${quantity}</span>
          <button class="increase">+</button>
        </div>
      </div>
      <button class="remove-btn" data-id="${product.id}">&times;</button>
    `;
    container.appendChild(item);
  });

  const discount = selected.size >= 3 ? subtotal * 0.3 : 0;
  const finalTotal = subtotal - discount;

  const fill = document.getElementById('progress-fill');
  fill.style.width = `${Math.min(selected.size / 3, 1) * 100}%`;

  discountText.textContent = `-$${discount.toFixed(2)}`;
  subtotalText.textContent = `$${finalTotal.toFixed(2)}`;

  if (selected.size < 3) {
    ctaBtn.disabled = true;
    ctaBtn.querySelector('.btn-text').textContent = `Add ${3 - selected.size} item${3 - selected.size > 1 ? 's' : ''} to proceed`;
  } else {
    ctaBtn.disabled = false;
    ctaBtn.querySelector('.btn-text').textContent = 'Add Bundle to Cart';
  }
}

document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('.toggle-btn');
  const removeBtn = e.target.closest('.remove-btn');

  if (toggleBtn && toggleBtn.dataset.id) {
    const id = Number(toggleBtn.dataset.id);
    const product = products.find(p => p.id === id);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.set(id, { product, quantity: 1 });
    }
    renderProducts();
    updateSidebar();
  }

  if (removeBtn && removeBtn.dataset.id) {
    const id = Number(removeBtn.dataset.id);
    selected.delete(id);
    renderProducts();
    updateSidebar();
  }

  if (e.target.classList.contains('increase') || e.target.classList.contains('decrease')) {
    const stepId = Number(e.target.closest('.stepper').dataset.id);
    const item = selected.get(stepId);
    if (!item) return;

    if (e.target.classList.contains('increase')) {
      item.quantity++;
    } else if (item.quantity > 1) {
      item.quantity--;
    }
    selected.set(stepId, item);
    updateSidebar();
  }

  const cta = e.target.closest('#add-to-cart');
if (cta) {
  console.log('Bundle:', Array.from(selected.entries()));
  alert('Bundle logged to console!');
}

});

renderProducts();
updateSidebar();
