'use strict';

const menu = {
    "pizza_class_1": [
        { "name": "Margherita", "contents": ["Tomatsås", "Ost"], "price": 65 },
        { "name": "Vesuvio", "contents": ["Tomatsås", "Ost", "Skinka"], "price": 65 },
        { "name": "Altono", "contents": ["Tomatsås", "Ost", "Tonfisk"], "price": 65 }
    ],
    "pizza_class_2": [
        { "name": "Calzone", "contents": ["Tomatsås", "Ost", "Skinka"], "price": 80 },
        { "name": "Capricciosa", "contents": ["Tomatsås", "Ost", "Skinka", "Champinjoner"], "price": 70 },
        { "name": "Tomaso", "contents": ["Tomatsås", "Ost", "Skinka", "a:Räkor"], "price": 70 },
        { "name": "Hawaii", "contents": ["Tomatsås", "Ost", "Skinka", "Ananas"], "price": 70 },
        { "name": "Oriental", "contents": ["Tomatsås", "Ost", "Skinka", "Köttfärs"], "price": 70 },
        { "name": "Venezia", "contents": ["Tomatsås", "Ost", "Skinka", "Tonfisk"], "price": 70 },
        { "name": "Bolognese", "contents": ["Tomatsås", "Ost", "Köttfärs", "Lök"], "price": 70 },
        { "name": "Napoli", "contents": ["Tomatsås", "Ost", "Räkor", "Champinjoner"], "price": 70 }
    ],
    "pizza_class_3": [
        { "name": "Bravo", "contents": ["Tomatsås", "Ost", "Skinka", "Bacon", "Lök", "a:Ägg"], "price": 75 },
        { "name": "Princessa", "contents": ["Tomatsås", "Ost", "Skinka", "a:Räkor", "Champinjoner"], "price": 75 },
        { "name": "Kroppkärr", "contents": ["Tomatsås", "Ost", "Skinka", "Köttfärs", "Champinjoner"], "price": 75 },
        { "name": "Afrikano", "contents": ["Tomatsås", "Ost", "Skinka", "Ananas", "Curry", "Banan"], "price": 75 },
        { "name": "Önska", "contents": ["Tomatsås", "Ost", "Skinka", "a:Räkor", "Champinjoner"], "price": 85 },
        { "name": "Lambada", "contents": ["Tomatsås", "Ost", "Skinka", "Köttfärs", "a:Räkor"], "price": 75 },
        { "name": "Alsterdalen", "contents": ["Tomatsås", "Ost", "Skinka", "a:Crabfish", "a:Räkor"], "price": 75 },
        { "name": "Paradis", "contents": ["Tomatsås", "Ost", "Skinka", "a:Räkor", "Ananas"], "price": 75 },
        { "name": "Roma", "contents": ["Tomatsås", "Ost", "Skinka", "Kantareller", "Tomater (färska)"], "price": 75 },
        { "name": "Banjogatan", "contents": ["Tomatsås", "Ost", "Skinka", "Salami", "Paprika"], "price": 75 },
        { "name": "Rimini", "contents": ["Tomatsås", "Ost", "Köttfärs", "Gorgonzolaost", "Lök"], "price": 75 },
        { "name": "Opera", "contents": ["Tomatsås", "Ost", "Köttfärs", "Ananas", "Curry", "Banan"], "price": 75 },
        { "name": "Mesopotamia", "contents": ["Tomatsås", "Ost", "Salami", "Köttfärs", "a:Nötter"], "price": 75 }
    ],
    "sauces": [
        { "name": "Bearnaisesås 10 cl ", "price": 10 },
        { "name": "Kebabsås mild 10 cl ", "price": 10 },
        { "name": "Kebabsås stark 10 cl ", "price": 10 },
        { "name": "Kebabsås blandad 10 cl ", "price": 10 },
        { "name": "Tzatzikisås 10 cl ", "price": 10 },
        { "name": "Vitlökssås 10 cl ", "price": 10 }
    ],
    "drinks": [
        { "name": "Coca-Cola 33 cl ", "price": 15 },
        { "name": "Coca-Cola light 33 cl ", "price": 15 },
        { "name": "Fanta 33 cl ", "price": 15 },
        { "name": "Sprite 33 cl ", "price": 15 },
        { "name": "Mineralvatten 33 cl ", "price": 15 },
        { "name": "Lättöl 33 cl ", "price": 15 },
        { "name": "Coca-Cola 50 cl ", "price": 20 },
        { "name": "Fanta 50 cl ", "price": 20 }
    ]
}
