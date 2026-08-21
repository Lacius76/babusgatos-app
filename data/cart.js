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

  function getLatestOrder() {
    const orders = loadOrders();
    return orders[0] || null;
  }

  function addOrderItemToCart(item) {
    const items = loadCart();
    const qty = Number(item.qty) || 1;
    const existing = items.find((entry) => entry.id === item.id);
    if (existing) {
      existing.qty = (Number(existing.qty) || 1) + qty;
    } else {
      items.push({
        id: item.id,
        name: item.name,
        detail: item.detail,
        price: item.price,
        img: item.img,
        qty,
        type: item.type,
        summaryLines: item.summaryLines,
        decorationLines: item.decorationLines,
      });
    }
    saveCart(items);
    return items;
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

  function updateQtyAt(index, delta) {
    const items = loadCart();
    const i = Number(index);
    if (!Number.isInteger(i) || i < 0 || i >= items.length) return items;
    const currentQty = Number(items[i].qty) || 1;
    const nextQty = Math.max(1, currentQty + Number(delta || 0));
    items[i].qty = nextQty;
    saveCart(items);
    return items;
  }

  function t(key) {
    return global.BabusgatosI18n?.t?.(key) || key;
  }

  function renderCartLines(items, { removable = true, quantityControls = false } = {}) {
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
        if (quantityControls) {
          return `
          <div class="cart-line cart-line--editable">
            <strong class="cart-line-name">${escapeHtml(item.name || "")}</strong>
            <img src="${escapeHtml(item.img || "")}" alt="">
            <span class="cart-line-detail">${escapeHtml(detail)}</span>
            <div class="cart-line-qty" role="group" aria-label="${escapeHtml(item.name || "Quantity")}">
              <button type="button" class="cart-qty-btn" data-cart-qty-change="${index}" data-delta="-1" aria-label="${escapeHtml(t("order.decreaseQty"))}">-</button>
              <span class="cart-qty-value">${String(qty).padStart(2, "0")}</span>
              <button type="button" class="cart-qty-btn" data-cart-qty-change="${index}" data-delta="1" aria-label="${escapeHtml(t("order.increaseQty"))}">+</button>
            </div>
            ${removeBtn}
          </div>`;
        }
        if (item.type === "custom-cake") {
          const lines = Array.isArray(item.summaryLines) && item.summaryLines.length
            ? item.summaryLines
            : String(detail).split(" · ").filter(Boolean);
          const decoLines = Array.isArray(item.decorationLines) ? item.decorationLines : [];
          const decoToggle = decoLines.length
            ? `<button type="button" class="cart-cake-toggle" data-cart-cake-toggle="${index}" aria-expanded="false">
                <span>${escapeHtml(t("cfg.cartDecorations").replace("{n}", String(decoLines.length)))}</span>
                <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
              </button>
              <ul class="cart-cake-deco-list" hidden>
                ${decoLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
              </ul>`
            : "";
          // Last summary line is often the decorations count — omit it when we have a toggle
          const visibleLines = decoLines.length && lines.length > 3
            ? lines.slice(0, -1)
            : lines;
          return `
          <div class="cart-line cart-line--cake">
            <img src="${escapeHtml(item.img || "")}" alt="">
            <div class="cart-line-main">
              <strong>${escapeHtml(qtyLabel + (item.name || ""))}</strong>
              ${visibleLines.map((line) => `<span class="cart-line-detail">${escapeHtml(line)}</span>`).join("")}
              ${decoToggle}
              <span class="cart-line-price">${escapeHtml(formatHuf(item.price))}</span>
            </div>
            ${removeBtn}
          </div>`;
        }
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
    bindCakeToggleButtons(root);
  }

  function bindCakeToggleButtons(root) {
    root?.querySelectorAll("[data-cart-cake-toggle]").forEach((btn) => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const list = btn.parentElement?.querySelector(".cart-cake-deco-list");
        if (!list) return;
        const open = list.hasAttribute("hidden");
        if (open) list.removeAttribute("hidden");
        else list.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.classList.toggle("is-open", open);
      });
    });
  }

  function bindQuantityButtons(root, onChange) {
    root?.querySelectorAll("[data-cart-qty-change]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateQtyAt(btn.getAttribute("data-cart-qty-change"), Number(btn.getAttribute("data-delta")));
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
    getLatestOrder,
    addOrderItemToCart,
    formatHuf,
    escapeHtml,
    cartTotal,
    addToCart,
    removeAt,
    updateQtyAt,
    renderCartLines,
    bindRemoveButtons,
    bindCakeToggleButtons,
    bindQuantityButtons,
    updateCartBadges,
  };
})(window);
