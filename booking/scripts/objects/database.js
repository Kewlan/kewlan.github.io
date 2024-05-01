'use strict';

class Action {
    /** @type {String} */
    #key;
    /** @type {any[]} */
    #data;

    constructor(key, ...data) {
        Object.seal(this);
        console.assert(typeof key === "string");
        this.#key = key;
        this.#data = data;
    }

    get key() { return this.#key; }
    get data() { return this.#data; }

    // String helpers
    static get ENQUEUE() { return "action_enqueue"; }
    static get DEQUEUE() { return "action_dequeue"; }
    static get BOOK_TABLE() { return "action_book_table"; }
    static get FREE_TABLE() { return "action_free_table"; }
}

const Database = new class {

    /** @type {Booker[]} */
    #queue = Array();
    /** 
     * For undo
     * @type {Action[]} 
     */
    #actionHistory = Array();
    /** 
     * For redo
     * @type {Action[]} 
     */
    #actionsUndone = Array();

    constructor() {
        Object.seal(this);
    }

    get queue() {
        return this.#queue;
    }

    /**
     * Standard and redo
     * @param {Action} action 
     */
    #action_perform(action) {
        console.assert(action instanceof Action);
        switch (action.key) {
            case Action.ENQUEUE: {
                /** @type {Booker} */
                const booker = action.data[0];
                console.assert(booker instanceof Booker);
                this.#queue.push(booker);
                break;
            }
            case Action.DEQUEUE: {
                /** @type {Booker} */
                const booker = action.data[0];
                const index = action.data[1];
                console.assert(booker instanceof Booker);
                console.assert(typeof index === "number");

                this.#queue.splice(index, 1);
                break;
            }
            case Action.BOOK_TABLE: {
                const id = action.data[0];
                /** @type {Booker} */
                const booker = action.data[1];
                console.assert(typeof id === "number");
                console.assert(booker instanceof Booker);

                TableRegister[id].book(booker.bookerName);
                this.#queue.shift();
                break;
            }
            case Action.FREE_TABLE: {
                const id = action.data[0];
                console.assert(typeof id === "number");
                TableRegister[id].free();
                break;
            }
            default: {
                console.error("UNIMPLEMENTED ACTION: " + action.key);
                break;
            }
        }
    }

    /**
     * Undo
     * @param {Action} action 
     */
    #action_undo(action) {
        console.assert(action instanceof Action);
        switch (action.key) {
            case Action.ENQUEUE: {
                this.#queue.pop();
                break;
            }
            case Action.DEQUEUE: {
                /** @type {Booker} */
                const booker = action.data[0];
                const index = action.data[1];
                console.assert(booker instanceof Booker);
                console.assert(typeof index === "number");
                this.#queue.splice(index, 1, booker);
                break;
            }
            case Action.BOOK_TABLE: {
                const id = action.data[0];
                /** @type {Booker} */
                const booker = action.data[1];
                console.assert(typeof id === "number");
                console.assert(booker instanceof Booker);
                TableRegister[id].free();
                this.#queue.splice(0, 0, booker);
                break;
            }
            case Action.FREE_TABLE: {
                const id = action.data[0];
                const bookerName = action.data[1];
                console.assert(typeof id === "number");
                console.assert(typeof bookerName === "string");
                TableRegister[id].book(bookerName);
                break;
            }
            default: {
                console.error("UNIMPLEMENTED ACTION: " + action.key);
                break;
            }
        }
    }

    canUndo() {
        return this.#actionHistory.length > 0;
    }

    canRedo() {
        return this.#actionsUndone.length > 0;
    }

    undo() {
        let action = this.#actionHistory.pop();
        if (action === undefined) {
            return;
        }
        this.#action_undo(action);
        this.#actionsUndone.push(action);
    }

    redo() {
        let action = this.#actionsUndone.pop();
        if (action === undefined) {
            return;
        }
        this.#action_perform(action);
        this.#actionHistory.push(action);
    }

    /**
     * Adds the entered person to the back of the queue.
     * @param {Booker} booking 
     */
    enqueue(booking) {
        console.assert(booking instanceof Booker);

        let action = new Action(Action.ENQUEUE, booking);
        this.#action_perform(action);
        this.#actionHistory.push(action);
        // Clear redo
        this.#actionsUndone.length = 0;

        //this.#queue.push(booking);
    }

    /**
     * Removes the person at the selected index from the queue
     * @param {Number} index
     */
    dequeue(index) {
        console.assert(typeof index === "number");

        let action = new Action(Action.DEQUEUE, this.#queue[index], index);
        this.#action_perform(action);
        this.#actionHistory.push(action);
        // Clear redo
        this.#actionsUndone.length = 0;

        //this.#queue.splice(index, 1);
    }

    /**
     * Books the selected table for the person first in the queue.
     * @param {Number} id 
     */
    bookTable(id) {
        console.assert(typeof id === "number");

        let action = new Action(Action.BOOK_TABLE, id - 1, this.queue[0]);
        this.#action_perform(action);
        this.#actionHistory.push(action);
        // Clear redo
        this.#actionsUndone.length = 0;

        // TableRegister[id - 1].book(this.queue[0].bookerName);
        // this.#queue.shift();
    }

    /**
     * Frees up the selected table.
     * @param {Number} id 
     */
    freeTable(id) {
        console.assert(typeof id === "number");

        let action = new Action(Action.FREE_TABLE, id - 1, TableRegister[id - 1].currentBookerName);
        this.#action_perform(action);
        this.#actionHistory.push(action);
        // Clear redo
        this.#actionsUndone.length = 0;

        // console.assert(typeof id === "number");
        // TableRegister[id - 1].free();
    }

    // Colin

    // Oskar

    // Albin

}