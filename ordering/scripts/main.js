'use strict';

window.addEventListener("load", function (e) {
    console.log("loaded");
    console.log(menu);

    Database.init();
    HTML_Handler.init();
});
