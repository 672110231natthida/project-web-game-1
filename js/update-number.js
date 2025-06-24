let cart = [];
let totalnumber = 0;

function addToCart(name, number) {
  // เพิ่มสินค้าไปในตะกร้า
  cart.push({ name, number });

  // อัปเดตจำนวนสินค้า
  totalnumber += number;

  // แสดงผลลัพธ์บนหน้าเว็บ
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total-number');

  // เคลียร์รายการเดิม
  cartItems.innerHTML = '';

  // แสดงจำนวนสินค้า
  total.textContent = totalnumber;
}