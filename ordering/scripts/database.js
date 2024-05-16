'use strict';

const Database = new class {

    #total_items = 0;

    init() {
        console.log("Database init");
        this.updateTotalItems();
    }

    updateTotalItems() {
        this.#total_items = 0;
        for (let card of HTML_Handler.ref_menu_list.childNodes) {
            if (card.nodeType != Node.ELEMENT_NODE) {
                continue;
            }
            this.#total_items += Number.parseInt(card.querySelector("input[type='number']").value);
        }
        HTML_Handler.ref_total_items.textContent = this.#total_items;
    }

}
