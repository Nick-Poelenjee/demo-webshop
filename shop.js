const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((product) => {
    const li = document.createElement("li");
    if (product.isCustom) {
      li.innerHTML = `<span class='basket-emoji'>🛠️</span> <span>${product.name}</span> <small>(Custom Request)</small>`;
    } else {
      const item = PRODUCTS[product];
      if (item) {
        li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span>`;
      }
    }
    basketList.appendChild(li);
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("custom-product-modal");
  const openModalButton = document.getElementById("open-modal-button");
  const closeModalButton = document.getElementById("close-modal");
  const customProductForm = document.getElementById("custom-product-form");

  // Open modal
  openModalButton?.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close modal
  closeModalButton?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Handle form submission
  customProductForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const productName = document.getElementById("product-name").value;
    const productDescription = document.getElementById("product-description").value;
    const productLink = document.getElementById("product-link").value;

    if (productName && productDescription) {
      const pseudoProduct = {
        id: `custom-${Date.now()}`,
        name: productName,
        description: productDescription,
        link: productLink,
        isCustom: true,
      };

      addToBasket(pseudoProduct);
      renderBasket();
      modal.classList.add("hidden");
      customProductForm.reset();
    } else {
      alert("Please fill in all required fields.");
    }
  });
});
