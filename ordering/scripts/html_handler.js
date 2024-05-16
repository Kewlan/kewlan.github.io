'use strict';

let counter = 0;
const MENU_TYPE_PIZZA_KLASS_1 = counter++;
const MENU_TYPE_PIZZA_KLASS_2 = counter++;
const MENU_TYPE_PIZZA_KLASS_3 = counter++;
const MENU_TYPE_SAUCES = counter++;
const MENU_TYPE_DRINKS = counter++;

const HTML_Handler = new class {

    /** @type {HTMLDivElement[]} */
    #ref_menu_lists = Array();
    get ref_menu_lists() { return this.#ref_menu_lists; }
    /** @type {HTMLSpanElement} */
    #ref_total_items;
    get ref_total_items() { return this.#ref_total_items; }
    /** @type {HTMLInputElement} */
    #ref_filter_input;
    get ref_filter_input() { return this.#ref_filter_input; }


    init() {
        console.log("HTML Handler init");

        // Get references
        this.#ref_menu_lists.push(document.getElementById("menu-list-pk1"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-pk2"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-pk3"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-sauces"));
        this.#ref_menu_lists.push(document.getElementById("menu-list-drinks"));

        this.#ref_total_items = document.getElementById("total-items");
        this.#ref_filter_input = document.getElementById("filter-input");

        // Fill menu UL element
        this.#fill_menu();

        // Filter
        this.#ref_filter_input.addEventListener("input", () => {
            this.#ref_menu_lists.forEach((menu_list, index) => {
                let allHidden = true;
                for (let card of menu_list.lastElementChild.childNodes) {
                    if (card.nodeType != Node.ELEMENT_NODE) {
                        continue;
                    }

                    let hideCard = card.querySelector("div>h5").textContent.toLowerCase().indexOf(this.#ref_filter_input.value.toLowerCase()) < 0;
                    card.classList.toggle("d-none", hideCard);
                    if (!hideCard) {
                        allHidden = false;
                    }
                }
                menu_list.classList.toggle("d-none", allHidden);
            });
        });
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
        card.classList.add("card", "mb-2", "overflow-hidden", "menu-item-shadow");
        {
            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "p-0", "pt-3");
            {
                // Header
                let headerRow = document.createElement("div");
                headerRow.classList.add("d-flex", "justify-content-between", "px-3");
                {
                    let item_name = document.createElement("h5");
                    // item_name.classList.add("m-0");
                    item_name.appendChild(document.createTextNode(menu_item.name));
                    headerRow.appendChild(item_name);

                    let price = document.createElement("span");
                    price.appendChild(document.createTextNode(menu_item.price + " kr"));
                    headerRow.appendChild(price);
                }
                cardBody.appendChild(headerRow);

                // Contents
                if (menu_item.contents) {
                    let ingredients = document.createElement("div");
                    ingredients.classList.add("d-flex", "flex-wrap", "px-3");
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
                    minusButton.classList.add("col-4", "fs-5", "fw-bold", "btn", "btn-danger", "border-0", "rounded-0");
                    minusButton.appendChild(document.createTextNode("-"));
                    buttonRow.appendChild(minusButton);

                    /** @type {HTMLInputElement} */
                    let amountInput = document.createElement("input");
                    amountInput.classList.add("col-4", "border-0", "border-top", "text-center");
                    amountInput.setAttribute("type", "number");
                    amountInput.setAttribute("value", "0");
                    amountInput.min = 0;
                    buttonRow.appendChild(amountInput);

                    let plusButton = document.createElement("button");
                    plusButton.classList.add("col-4", "fs-5", "fw-bold", "btn", "btn-success", "border-0", "rounded-0");
                    plusButton.appendChild(document.createTextNode("+"));
                    buttonRow.appendChild(plusButton);

                    function toggleHighlight() {
                        card.classList.toggle("highlight-outline", Number.parseInt(amountInput.value) > 0);
                    }

                    minusButton.addEventListener("click", function () {
                        if (amountInput.value > 0) {
                            amountInput.value--;
                            Database.updateTotalItems();
                        }
                        toggleHighlight();
                    });
                    amountInput.addEventListener("input", function () {
                        Database.updateTotalItems();
                        toggleHighlight();
                    });
                    plusButton.addEventListener("click", function () {
                        amountInput.value++;
                        Database.updateTotalItems();
                        toggleHighlight();
                    });
                }
                cardBody.appendChild(buttonRow);
            }
            card.appendChild(cardBody);
        }
        return card;
    }

}
