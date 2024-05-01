'use strict';

class Booker {
    #bookerName = String();
    #seatAmount = Number();

    /**
     * A fella' to be added to the queue, with a request for a minimum number of seats.
     * @param {String} bookerName The name of the person.
     * @param {Number} seatAmount The minimum amount of seats required.
     */
    constructor(bookerName, seatAmount) {
        Object.seal(this);
        console.assert(typeof bookerName === "string");
        console.assert(typeof seatAmount === "number");
        this.#bookerName = bookerName;
        this.#seatAmount = seatAmount;
    }

    get bookerName() { return this.#bookerName; }
    get seatAmount() { return this.#seatAmount; }
}
