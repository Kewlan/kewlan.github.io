'use strict';

const HTMLHandler = new class {
    /** @type {HTMLUListElement} */
    #ref_queueList;
    /** @type {HTMLUListElement} */
    #ref_tableList_empty;
    /** @type {HTMLUListElement} */
    #ref_tableList_taken;
    /** @type {HTMLButtonElement} */
    #ref_enqueueBtn;
    /** @type {HTMLButtonElement} */
    #ref_bookTableBtn;
    /** @type {HTMLInputElement} */
    #ref_bookerNameInput;
    /** @type {HTMLInputElement} */
    #ref_bookerAmountInput;
    /** @type {HTMLSpanElement} */
    #ref_nextInQueueLabel;
    /** @type {HTMLInputElement} */
    #ref_filterInput;
    /** @type {HTMLButtonElement} */
    #ref_modalConfirmBtn;
    /** @type {HTMLButtonElement} */
    #ref_undoBtn;
    /** @type {HTMLButtonElement} */
    #ref_redoBtn;

    init() {
        Object.seal(this);
        this.#ref_queueList = document.getElementById("queue-list");
        this.#ref_tableList_empty = document.getElementById("table-list-empty");
        this.#ref_tableList_taken = document.getElementById("table-list-taken");
        this.#ref_enqueueBtn = document.getElementById("enqueue-btn");
        this.#ref_bookTableBtn = document.getElementById("add-table-btn");
        this.#ref_bookerNameInput = document.getElementById("booker-name");
        this.#ref_bookerAmountInput = document.getElementById("booker-amount");
        this.#ref_nextInQueueLabel = document.getElementById("next-in-queue-label");
        this.#ref_filterInput = document.getElementById("filter-input");
        this.#ref_modalConfirmBtn = document.getElementById("confirm-modal-btn");
        this.#ref_undoBtn = document.getElementById("undo-btn");
        this.#ref_redoBtn = document.getElementById("redo-btn");

        this.#ref_bookerAmountInput.addEventListener("input", function () {
            if (this.value == 0) {
                return;
            }
            if (this.value < 1) {
                this.value = 1;
            }
            else if (this.value > 6) {
                this.value = 6;
            }
        });

        this.#ref_enqueueBtn.addEventListener("click", () => {
            // Verify input
            if (this.#ref_bookerNameInput.value == "" || this.#ref_bookerAmountInput.value == 0) {
                return;
            }

            // Limit max seats
            if (this.#ref_bookerAmountInput.value < 1) {
                this.#ref_bookerAmountInput.value = 1;
            }
            if (this.#ref_bookerAmountInput.value > 6) {
                this.#ref_bookerAmountInput.value = 6;
            }

            // Add to queue
            Database.enqueue(new Booker(this.#ref_bookerNameInput.value, Number.parseInt(this.#ref_bookerAmountInput.value)));
            this.#updateAll();

            // Clear input fields
            this.#ref_bookerNameInput.value = "";
            this.#ref_bookerAmountInput.value = "";
        });

        this.#ref_bookTableBtn.addEventListener("click", () => {
            if (Database.queue.length === 0) {
                return;
            }

            let selectedTable = this.getSelectedTable();
            if (selectedTable === null) {
                return;
            }

            Database.bookTable(Number.parseInt(selectedTable.getAttribute("data-table-id")));
            this.#updateAll();
        });

        this.#ref_tableList_empty.addEventListener("click", (e) => {
            const ulElement = e.currentTarget;
            const selectedListElement = e.target.closest("li");

            // First unselect any and all list elements
            ulElement.childNodes.forEach(function (element) {
                if (element.nodeType != Node.ELEMENT_NODE) {
                    return;
                }
                element.classList.remove("text-bg-primary");
            });

            if (selectedListElement == null) {
                return;
            }

            // Then add to clicked list item
            selectedListElement.classList.add("text-bg-primary");

            this.toggleDisabled();
        });

        this.#ref_tableList_taken.addEventListener("click", (event) => {
            if (event.target.hasAttribute("icon-remove")) {
                // Change action of confirmBtn
                this.#ref_modalConfirmBtn.setAttribute("action", "free-table");

                // Copies id to confirmBtn
                let id = event.target.closest("li").getAttribute("id");
                this.#ref_modalConfirmBtn.setAttribute("table-id", id);

                // Changes modal text
                this.#changeModalText();
            }
        });

        this.#ref_queueList.addEventListener("click", (event) => {
            if (event.target.hasAttribute("icon-remove")) {
                // Change action of confirmBtn
                this.#ref_modalConfirmBtn.setAttribute("action", "remove-booking");

                //  Copies index-value to confirmBtn
                let index = event.target.closest("li").getAttribute("queue-index");
                this.#ref_modalConfirmBtn.setAttribute("queue-index", index);

                // Change modal text
                this.#changeModalText();
            }
        });

        this.#ref_filterInput.addEventListener("input", (e) => {
            this.#updateAll();
        });

        this.#ref_modalConfirmBtn.addEventListener("click", () => {
            /* 
            Different result depending on the "action" attribute of the confirm-btn in ref_modalConfirmBtn
                This means that the same modal can be used, requires only the modal-text to be changed
            
            Either free table or remove booking from queue
            Btn also stores "id" if for freeing table and "index" for dequeueing 
            */
            if (this.#ref_modalConfirmBtn.getAttribute("action") == "free-table") {
                // Get id from confirmBtn to free correct table in model
                let id = Number.parseInt(this.#ref_modalConfirmBtn.getAttribute("table-id"));

                // Frees/resets table in model
                Database.freeTable(id);
            }
            else if (this.#ref_modalConfirmBtn.getAttribute("action") == "remove-booking") {
                // Get index from confirmBtn to dequeue correct index in model
                let index = Number.parseInt(this.#ref_modalConfirmBtn.getAttribute("queue-index"));

                // Dequeue
                Database.dequeue(index);
            }

            this.#updateAll();
        });

        this.#ref_undoBtn.addEventListener("click", () => {
            Database.undo();
            this.#updateAll();
        });

        this.#ref_redoBtn.addEventListener("click", () => {
            Database.redo();
            this.#updateAll();
        });

        this.#updateAll();
    }

    getSelectedTable() {
        for (let table of this.#ref_tableList_empty.childNodes) {
            if (table.nodeType != Node.ELEMENT_NODE) {
                continue;
            }
            if (table.classList.contains("text-bg-primary")) {
                return table;
            }
        }
        return null;
    }

    #createIconX(color, fontsize) {
        let icon = document.createElement("i");
        icon.setAttribute("class", "bi bi-x-circle-fill cursor-click");
        icon.setAttribute("style", "color: " + color + ";" + "font-size: " + fontsize + ";");
        icon.setAttribute("icon-remove", "");
        icon.setAttribute("data-bs-toggle", "modal");
        icon.setAttribute("data-bs-target", "#confirmModal");
        return icon;
    }

    /**
     * To be used in the table lists
     * @param {Number} titleContent The table id to be used in the title text
     * @param {String} textContent The main text below the title
     * @param {Boolean} includeXbutton Adds the X button
     * @returns The card as an li element
     */
    #createListElement(titleContent, textContent, includeXbutton) {
        console.assert(typeof titleContent === "string");
        console.assert(typeof textContent === "string");
        console.assert(typeof includeXbutton === "boolean" || typeof includeXbutton === "undefined");

        let card = document.createElement("li");
        card.classList.add("list-group-item");
        {
            let row = document.createElement("div");
            row.classList.add("row", "g-0", "align-items-center");
            {
                let col = document.createElement("h4");
                col.classList.add("col-5", "m-0");
                col.textContent = titleContent;
                row.appendChild(col);
            }
            {
                let col = document.createElement("div");
                col.classList.add("col-5");
                col.textContent = textContent;
                row.appendChild(col);
            }
            {
                let col = document.createElement("div");
                col.classList.add("col-2", "d-flex", "align-items-center", "justify-content-end");
                if (includeXbutton) {
                    col.appendChild(this.#createIconX("red", "16px"));
                }
                row.appendChild(col);
            }
            card.appendChild(row);
        }
        return card;
    }

    #updateAll() {
        // generateQueueList 
        {
            let queueCount = 0;
            this.#ref_queueList.innerHTML = "";
            Database.queue.forEach((booker, index) => {
                let newLi = this.#createListElement((index + 1) + ". " + booker.bookerName, "Seats: " + booker.seatAmount, true);
                newLi.setAttribute("queue-index", index);
                this.#ref_queueList.appendChild(newLi);
                queueCount++;
            });
            this.#ref_queueList.previousElementSibling.classList.toggle("d-none", queueCount > 0);
        }

        // updateNextInQueue
        {
            if (Database.queue.length > 0) {
                this.#ref_nextInQueueLabel.textContent = Database.queue[0].bookerName + " (" + Database.queue[0].seatAmount + ")";
            } else {
                this.#ref_nextInQueueLabel.textContent = "---";
            }
        }

        // generateEmptyTableList
        {
            let visibleRows = 0;
            this.#ref_tableList_empty.innerHTML = "";
            for (let i = 0; i < TableRegister.length; i++) {
                if (TableRegister[i].isEmpty == true) {
                    let item = this.#createListElement("Table " + TableRegister[i].id, TableRegister[i].seatAmount + " seats");
                    item.classList.add("cursor-click");
                    if (Database.queue.length > 0 && Database.queue[0].seatAmount > TableRegister[i].seatAmount) {
                        item.classList.add("d-none");
                    } else {
                        visibleRows++;
                    }
                    item.setAttribute("data-table-id", TableRegister[i].id);
                    this.#ref_tableList_empty.appendChild(item);
                }
            }
            this.#ref_tableList_empty.previousElementSibling.classList.toggle("d-none", visibleRows > 0);
        }

        // generateTakenTableList
        {
            let bookedTables = 0;
            this.#ref_tableList_taken.innerHTML = "";
            for (let i = 0; i < TableRegister.length; i++) {
                if (TableRegister[i].isEmpty == false) {
                    let item = this.#createListElement("Table " + TableRegister[i].id, TableRegister[i].currentBookerName, true);
                    if (this.#ref_filterInput.value.length > 0) {
                        if (TableRegister[i].currentBookerName.toLowerCase().indexOf(this.#ref_filterInput.value.toLowerCase()) == -1) {
                            item.classList.add("d-none");
                        }
                    }
                    bookedTables++;
                    item.setAttribute("id", TableRegister[i].id);
                    this.#ref_tableList_taken.appendChild(item);
                }
            }
            this.#ref_tableList_taken.previousElementSibling.classList.toggle("d-none", bookedTables > 0);
        }

        // Disable buttons that would have no effect
        this.toggleDisabled();

    }

    // Colin

    toggleDisabled() {
        this.#ref_bookTableBtn.classList.toggle("disabled", Database.queue.length === 0 || this.getSelectedTable() === null);
        this.#ref_undoBtn.classList.toggle("disabled", !Database.canUndo());
        this.#ref_redoBtn.classList.toggle("disabled", !Database.canRedo());
    }

    // Oskar

    // Albin
    #changeModalText() {
        let modalTitle = document.getElementById("confirmModalTitle");
        let modalBody = document.getElementById("confirmModalBody");
        let btn = this.#ref_modalConfirmBtn;
        // Change modal text based on "action"-attribute
        if (btn.getAttribute("action") == "remove-booking") {
            let bookingSelected = Database.queue[btn.getAttribute("queue-index")];
            modalTitle.textContent = "Remove booking";
            modalBody.children[0].textContent = "Are you sure you want to remove ";
            modalBody.children[1].textContent = bookingSelected.bookerName;
            modalBody.children[2].textContent = " from queue?";
        }
        else if (btn.getAttribute("action") == "free-table") {
            modalTitle.textContent = "Free table";
            modalBody.children[0].textContent = "Are you sure you want to free up ";
            modalBody.children[1].textContent = "Table " + btn.getAttribute("table-id");
            modalBody.children[2].textContent = " ?";

        }
    }

}
