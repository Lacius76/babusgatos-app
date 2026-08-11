/**
 * Shared cart helpers (sessionStorage) + past orders (localStorage).
 * Used by index popover, elorendeles sidebar, checkout.
 */
(function (global) {
  const CART_KEY = "babusgatos_cart";
  const ORDERS_KEY = "babusgatos_orders";

  function loadCart() {
    try {
      const raw = sessionStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    global.dispatchEvent(new CustomEvent("babusgatos:cartchange", { detail: { items } }));
  }

  function clearCart() {
    sessionStorage.removeItem(CART_KEY);
    global.dispatchEvent(new CustomEvent("babusgatos:cartchange", { detail: { items: [] } }));
  }

  function loadOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    global.dispatchEvent(new CustomEvent("babusgatos:orderschange", { detail: { orders } }));
  }

  function addOrder({ payment, items }) {
    const orderItems = (items || []).map((item) => ({ ...item }));
    if (!orderItems.length) return loadOrders();
    const orders = loadOrders();
    orders.unshift({
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      payment: payment || "",
      items: orderItems,
    });
    saveOrders(orders);
    return orders;
  }

  function removeOrderItem(orderId, itemIndex) {
    const orders = loadOrders()
      .map((order) => {
        if (order.id !== orderId) return order;
        const items = (order.items || []).filter((_, index) => index !== Number(itemIndex));
        return { ...order, items };
      })
      .filter((order) => (order.items || []).length > 0);
    saveOrders(orders);
    return orders;
  }

  function formatHuf(amount) {
    return `${Number(amount || 0).toLocaleString("hu-HU")} Ft`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cartTotal(items) {
    return (items || []).reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
      0
    );
  }

  function addToCart(product) {
    const items = loadCart();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.qty = (Number(existing.qty) || 1) + 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    saveCart(items);
    return items;
  }

  function removeAt(index) {
    const items = loadCart();
    items.splice(Number(index), 1);
    saveCart(items);
    return items;
  }

  function t(key) {
    return global.BabusgatosI18n?.t?.(key) || key;
  }

  function renderCartLines(items, { removable = true } = {}) {
    if (!items.length) {
      return `<p class="cart-empty">${escapeHtml(t("order.cartEmpty"))}</p>`;
    }
    return items
      .map((item, index) => {
        const qty = Number(item.qty) || 1;
        const detail = item.detail || "";
        const qtyLabel = qty > 1 ? `${qty} × ` : "";
        const removeBtn = removable
          ? `<button type="button" class="cart-line-remove" data-cart-remove="${index}" aria-label="${escapeHtml(t("order.removeFromCart"))}">
              <span class="material-symbols-outlined">close</span>
            </button>`
          : "";
        return `
          <div class="cart-line">
            <img src="${escapeHtml(item.img || "")}" alt="">
            <div>
              <strong>${escapeHtml(item.name || "")}</strong>
              <span>${escapeHtml(qtyLabel + detail)}</span>
            </div>
            ${removeBtn}
          </div>`;
      })
      .join("");
  }

  function bindRemoveButtons(root, onChange) {
    root?.querySelectorAll("[data-cart-remove]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeAt(btn.getAttribute("data-cart-remove"));
        onChange?.(loadCart());
      });
    });
  }

  function updateCartBadges(items) {
    const count = (items || loadCart()).reduce((n, item) => n + (Number(item.qty) || 1), 0);
    document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
  }

  global.BabusgatosCart = {
    CART_KEY,
    ORDERS_KEY,
    loadCart,
    saveCart,
    clearCart,
    loadOrders,
    saveOrders,
    addOrder,
    removeOrderItem,
    formatHuf,
    escapeHtml,
    cartTotal,
    addToCart,
    removeAt,
    renderCartLines,
    bindRemoveButtons,
    updateCartBadges,
  };
})(window);
