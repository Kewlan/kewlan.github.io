'use strict';

const Database = new class {

    #total_items = 0;

    init() {
        console.log("Database init");
        this.updateTotalItems();
    }

    updateTotalItems() {
        this.#total_items = 0;

        HTML_Handler.ref_menu_lists.forEach((menu_list, index) => {
            for (let card of menu_list.lastElementChild.childNodes) {
                if (card.nodeType != Node.ELEMENT_NODE) {
                    continue;
                }
                this.#total_items += Number.parseInt(card.querySelector("input[type='number']").value);
            }
        });
        HTML_Handler.ref_total_items.textContent = this.#total_items;
    }

}
