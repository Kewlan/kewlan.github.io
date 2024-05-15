'use strict';

const HTML_Handler = new class {

    /** @type {HTMLDivElement} */
    #menu_list;

    init() {
        console.log("HTML Handler init");

        // Get references
        this.#menu_list = document.getElementById("menu-list");
        console.log(this.#menu_list);

        // Fill menu UL element
        this.#fill_menu();
    }

    #fill_menu() {
        for (let menu_item of menu.pizza_class_1) {
            // console.log(menu_item);
            this.#menu_list.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.pizza_class_2) {
            this.#menu_list.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.pizza_class_3) {
            this.#menu_list.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.sauces) {
            this.#menu_list.appendChild(this.#create_menu_card(menu_item));
        }
        for (let menu_item of menu.drinks) {
            this.#menu_list.appendChild(this.#create_menu_card(menu_item));
        }
    }

    #create_menu_card(menu_item) {
        let card = document.createElement("div");
        card.classList.add("card", "my-3", "overflow-hidden");
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
                }
                cardBody.appendChild(buttonRow);
            }
            card.appendChild(cardBody);
        }
        return card;
    }

}
