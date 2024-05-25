'use strict';

window.addEventListener("load", function (e) {
    MenuHandler.init();
});

let counter = 0;
const MENU_TYPE_PIZZA_KLASS_1 = counter++;
const MENU_TYPE_PIZZA_KLASS_2 = counter++;
const MENU_TYPE_PIZZA_KLASS_3 = counter++;
const MENU_TYPE_SAUCES = counter++;
const MENU_TYPE_DRINKS = counter++;

const MenuHandler = new class {

    orderCount = 0;

    /** @type {HTMLSpanElement} */
    #ref_order_num;
    /** @type {HTMLDivElement[]} */
    #ref_menu_lists = Array();
    /** @type {HTMLDivElement} */
    #ref_menu_empty;
    /** @type {HTMLSpanElement} */
    #ref_total_items;
    /** @type {HTMLUListElement} */
    #ref_receipt_list;
    /** @type {HTMLSpanElement} */
    #ref_total_cost;

    /** @type {HTMLInputElement} */
    #ref_filter_input;
    /** @type {HTMLElement} */
    #ref_filter_icon;

    /** @type {HTMLDivElement} */
    #ref_receipt_orders;
    /** @type {HTMLDivElement} */
    #ref_receipt_empty;

    /** @type {HTMLTextAreaElement} */
    #ref_textarea_notes;
    /** @type {HTMLButtonElement} */
    #ref_reset_btn;
    /** @type {HTMLButtonElement} */
    #ref_send_btn;

    init() {
        // Get references
        this.#ref_menu_lists.push(document.getElementById("menu-list-pk1"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-pk2"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-pk3"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-sauces"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-drinks"));
        this.#ref_menu_empty = document.getElementById("menu-empty");

        this.#ref_order_num = document.getElementById("order-num");
        this.#ref_total_items = document.getElementById("total-items");

        this.#ref_filter_input = document.getElementById("filter-input");
        this.#ref_filter_icon = document.getElementById("filter-icon");

        this.#ref_receipt_list = document.getElementById("receipt-list");
        this.#ref_receipt_orders = document.getElementById("receipt-orders");
        this.#ref_receipt_empty = document.getElementById("receipt-empty");
        this.#ref_total_cost = document.getElementById("total-cost");

        this.#ref_textarea_notes = document.getElementById("textarea-notes");
        this.#ref_reset_btn = document.getElementById("reset-btn");
        this.#ref_send_btn = document.getElementById("send-btn");

        this.orderCount = 1;

        // Fill menu UL element
        this.#fill_menu();

        // Filter
        this.#ref_filter_input.addEventListener("input", () => {
            this.#checkFilter();
        });
        this.#ref_filter_icon.addEventListener("click", () => {
            this.#ref_filter_input.value = "";
            this.#checkFilter();
        });

        this.#ref_reset_btn.addEventListener("click", () => {
            this.#finishOrder(false);
        });

        this.#ref_send_btn.addEventListener("click", () => {
            this.#finishOrder(true);
        });

        // Full refresh
        this.#updateTotalItems();
        this.#updateReceiptList();
    }

    #fill_menu() {
        for (let menu_item of menu.pizza_class_1) {
            // console.log(menu_item);
            this.#ref_menu_lists[MENU_TYPE_PIZZA_KLASS_1].lastElementChild.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.pizza_class_2) {
            this.#ref_menu_lists[MENU_TYPE_PIZZA_KLASS_2].lastElementChild.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.pizza_class_3) {
            this.#ref_menu_lists[MENU_TYPE_PIZZA_KLASS_3].lastElementChild.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.sauces) {
            this.#ref_menu_lists[MENU_TYPE_SAUCES].lastElementChild.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.drinks) {
            this.#ref_menu_lists[MENU_TYPE_DRINKS].lastElementChild.appendChild(this.#create_menu_card(menu_item));
        }
    }

    #create_menu_card(menu_item) {
        let card = document.createElement("div");
        card.classList.add("card", "mb-3", "overflow-hidden", "menu-item-shadow");
        {
            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "p-0", "pt-3");
            {
                // Header
                let headerRow = document.createElement("div");
                headerRow.classList.add("d-flex", "justify-content-between", "mb-1", "px-3");
                {
                    let item_name = document.createElement("span");
                    item_name.classList.add("fs-4", "fw-semibold");
                    item_name.setAttribute("data-name", "");
                    item_name.appendChild(document.createTextNode(menu_item.name));
                    headerRow.appendChild(item_name);

                    let price = document.createElement("span");
                    price.classList.add("fs-4");
                    price.setAttribute("data-price", "");
                    price.appendChild(document.createTextNode(menu_item.price + " kr"));
                    headerRow.appendChild(price);
                }
                cardBody.appendChild(headerRow);

                // Contents
                if (menu_item.contents) {
                    let ingredients = document.createElement("div");
                    ingredients.classList.add("d-flex", "flex-wrap", "px-3", "fs-5");
                    {
                        for (let content of menu_item.contents) {
                            let ingredient = document.createElement("div");
                            ingredient.classList.add("px-1", "mb-1", "me-1", "border", "rounded");
                            if (content.substring(0, 2) == "a:") {
                                content = content.substring(2);
                                ingredient.classList.add("bg-warning-subtle", "text-warning-emphasis");
                                // Warning sign
                                let warningSign = document.createElement("i");
                                {
                                    warningSign.classList.add("bi", "bi-exclamation-triangle-fill", "me-1");
                                }
                                ingredient.appendChild(warningSign);
                            }
                            ingredient.appendChild(document.createTextNode(content));
                            ingredients.appendChild(ingredient);
                        }
                    }
                    cardBody.appendChild(ingredients);
                }

                // Buttons
                let buttonRow = document.createElement("div");
                buttonRow.classList.add("row", "m-0", "mt-2");
                {
                    let minusButton = document.createElement("button");
                    minusButton.classList.add("col-4", "p-0", "fs-1", "fw-bold", "bi", "bi-dash", "fw-bold", "btn", "btn-danger", "border-0", "rounded-0");
                    //minusButton.appendChild(document.createTextNode("-"));
                    buttonRow.appendChild(minusButton);

                    /** @type {HTMLInputElement} */
                    let amountInput = document.createElement("input");
                    amountInput.classList.add("col-4", "border-0", "border-top", "text-center", "fs-5");
                    amountInput.setAttribute("type", "number");
                    amountInput.setAttribute("value", "0");
                    amountInput.min = 0;
                    buttonRow.appendChild(amountInput);

                    let plusButton = document.createElement("button");
                    plusButton.classList.add("col-4", "p-0", "fs-1", "fw-bold", "bi", "bi-plus", "fw-bold", "btn", "btn-success", "border-0", "rounded-0");
                    //plusButton.appendChild(document.createTextNode("+"));
                    buttonRow.appendChild(plusButton);

                    function toggleHighlight() {
                        let amount = Number.parseInt(amountInput.value);
                        if (Number.isNaN(amount)) {
                            amount = 0;
                        }
                        card.classList.toggle("highlight-outline", amount > 0);
                    }

                    minusButton.addEventListener("click", () => {
                        if (amountInput.value > 0) {
                            amountInput.value--;
                        }
                        toggleHighlight();
                        this.#updateTotalItems();
                        this.#updateReceiptList();
                    });
                    amountInput.addEventListener("input", () => {
                        toggleHighlight();
                        this.#updateTotalItems();
                        this.#updateReceiptList();
                    });
                    plusButton.addEventListener("click", () => {
                        amountInput.value++;
                        toggleHighlight();
                        this.#updateTotalItems();
                        this.#updateReceiptList();
                    });
                }
                cardBody.appendChild(buttonRow);
            }
            card.appendChild(cardBody);
        }
        return card;
    }

    #checkFilter() {
        let anyFound = false;

        this.#ref_menu_lists.forEach((menu_list, index) => {
            let allHidden = true;
            for (let card of menu_list.lastElementChild.childNodes) {
                if (card.nodeType != Node.ELEMENT_NODE) {
                    continue;
                }

                let hideCard = card.querySelector("[data-name]").textContent.toLowerCase().indexOf(this.#ref_filter_input.value.toLowerCase()) < 0;
                card.classList.toggle("d-none", hideCard);
                if (!hideCard) {
                    anyFound = true;
                    allHidden = false;
                }
            }
            menu_list.classList.toggle("d-none", allHidden);
        });

        this.#ref_menu_empty.classList.toggle("d-none", anyFound);

        // Icon
        this.#ref_filter_icon.classList.toggle("bi-search", this.#ref_filter_input.value.length == 0);
        this.#ref_filter_icon.classList.toggle("bi-x-circle-fill", this.#ref_filter_input.value.length != 0);
        this.#ref_filter_icon.classList.toggle("text-danger", this.#ref_filter_input.value.length != 0);
    }

    #updateTotalItems() {
        let total_items = 0;

        this.#ref_menu_lists.forEach((menu_list, index) => {
            for (let card of menu_list.lastElementChild.childNodes) {
                if (card.nodeType != Node.ELEMENT_NODE) {
                    continue;
                }
                let amount = Number.parseInt(card.querySelector("input[type='number']").value);
                if (Number.isNaN(amount)) {
                    amount = 0;
                }
                total_items += amount;
            }
        });
        this.#ref_total_items.textContent = total_items;
    }

    #updateReceiptList() {
        let totalPrice = 0;

        // Clear previous
        this.#ref_receipt_list.innerHTML = "";

        this.#ref_menu_lists.forEach((menu_list, index) => {

            for (let card of menu_list.lastElementChild.childNodes) {
                if (card.nodeType != Node.ELEMENT_NODE) {
                    continue;
                }

                let name = card.querySelector("[data-name]").textContent;
                let price = Number.parseInt(card.querySelector("[data-price]").textContent);
                let amount = Number.parseInt(card.querySelector("input[type='number']").value);
                if (Number.isNaN(amount)) {
                    amount = 0;
                }
                // console.log(name, price, amount);

                if (amount == 0) {
                    continue;
                }

                let li = document.createElement("li");
                li.classList.add("d-flex");
                {
                    let columnName = document.createElement("div");
                    columnName.classList.add("flex-fill");
                    columnName.textContent = name;
                    li.appendChild(columnName);

                    if (amount > 1) {
                        let columnAmount = document.createElement("div");
                        columnAmount.classList.add("col-3", "text-end");
                        columnAmount.textContent = amount + "*" + price; // Inspirerat av ICA kvitto
                        li.appendChild(columnAmount);
                    }

                    let columnPrice = document.createElement("div");
                    columnPrice.classList.add("col-3", "text-end");
                    columnPrice.textContent = (price * amount);
                    li.appendChild(columnPrice);
                }
                this.#ref_receipt_list.appendChild(li);

                totalPrice += price * amount;
            }

        });

        this.#ref_total_cost.textContent = totalPrice + " kr";

        this.#ref_receipt_orders.classList.toggle("d-none", totalPrice == 0);
        this.#ref_receipt_empty.classList.toggle("d-none", totalPrice != 0);
    }

    /**
     * Restores everything to it's original state, and can send
     * @param {boolean} send True if send, false if reset
     */
    #finishOrder(send) {
        // Restore menu item cards
        this.#ref_menu_lists.forEach((menu_list, index) => {
            for (let card of menu_list.lastElementChild.childNodes) {
                if (card.nodeType != Node.ELEMENT_NODE) {
                    continue;
                }
                card.classList.remove("highlight-outline");
                card.querySelector("input[type='number']").value = 0;
            }
        });

        // Close offcanvas and modal
        let overlays = [
            bootstrap.Offcanvas.getInstance(document.getElementById("receiptOffcanvas")),
            bootstrap.Modal.getInstance(document.getElementById("confirmModal")),
            bootstrap.Modal.getInstance(document.getElementById("resetModal")),
        ];
        for (let overlay of overlays) {
            if (overlay) {
                overlay.hide();
            }
        }

        // Clear filter
        this.#ref_filter_input.value = "";
        this.#checkFilter();

        // Clear notes
        this.#ref_textarea_notes.value = "";

        // Update all
        this.#updateTotalItems();
        this.#updateReceiptList();

        if (send) {
            // Increase order count
            this.orderCount++;
            this.#ref_order_num.textContent = this.orderCount;

            // This is where it'd send the data to the kitchen and checkout
            // ...
        }
    }

}
