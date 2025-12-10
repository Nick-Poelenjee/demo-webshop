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
    const item = PRODUCTS[product];
    if (item) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span>`;
      basketList.appendChild(li);
    }
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

// Modal handling
const modal = document.getElementById("customProductModal");
const closeButton = document.querySelector(".close-button");
const cancelButton = document.getElementById("cancelButton");
const customProductForm = document.getElementById("customProductForm");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

closeButton.addEventListener("click", toggleModal);
cancelButton.addEventListener("click", toggleModal);

// Form submission
customProductForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const productName = document.getElementById("productName").value;
  const productDescription = document.getElementById("productDescription").value;
  const productLink = document.getElementById("productLink").value;

  const pseudoProduct = {
    id: `custom-${Date.now()}`,
    name: productName,
    description: productDescription,
    link: productLink,
    isCustom: true,
  };

  addToBasket(pseudoProduct);
  toggleModal();
});

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Update basket rendering to separate custom products
function renderBasket() {
  const basketContainer = document.getElementById("basket");
  basketContainer.innerHTML = "";

  basketItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("basket-item");

    if (item.isCustom) {
      itemElement.classList.add("custom-item");
      itemElement.innerHTML = `
        <p><strong>${item.name}</strong> (Custom Request)</p>
        <p>${item.description}</p>
        <p><a href="${item.link}" target="_blank">Reference Link</a></p>
        <p class="notification">This is a custom requested item.</p>
      `;
    } else {
      itemElement.innerHTML = `<p>${item.name}</p>`;
    }

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeFromBasket(item.id));

    itemElement.appendChild(removeButton);
    basketContainer.appendChild(itemElement);
  });
}
