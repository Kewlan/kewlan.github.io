'use strict';

class Table {
    #id = Number();
    #seatAmount = Number();
    #isEmpty = Boolean(true);
    #currentBookerName = String();

    /**
     * A table, recognized by it's id. Contains a certain number of seats. Stores if it's taken, and if so, the name of the booker.
     * @param {Number} id The table id.
     * @param {Number} seatAmount The maximum amount of available seats.
     */
    constructor(id, seatAmount) {
        Object.seal(this);
        console.assert(typeof id === "number");
        console.assert(typeof seatAmount === "number");
        this.#id = id;
        this.#seatAmount = seatAmount;
    }

    get id() { return this.#id; }
    get seatAmount() { return this.#seatAmount; }
    get isEmpty() { return this.#isEmpty; }
    get currentBookerName() { return this.#currentBookerName; }

    /**
     * Sets the table to taken and assign the booker's name to this table.
     * @param {String} newBookerName The name of the booker.
     */
    book(newBookerName) {
        console.assert(typeof newBookerName === "string");
        this.#isEmpty = false;
        this.#currentBookerName = newBookerName;
    }

    /**
     * Frees the table and removes the booker's name from this table.
     */
    free() {
        this.#isEmpty = true;
        this.#currentBookerName = undefined;
    }

    // Overload
    toString() {
        return "Table " + this.#id;
    }
};

let idCounter = 1;
const TableRegister = [
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 4),
    new Table(idCounter++, 2),
    new Table(idCounter++, 2),
    new Table(idCounter++, 6),
    new Table(idCounter++, 2),
    new Table(idCounter++, 2),
    new Table(idCounter++, 2),
];
