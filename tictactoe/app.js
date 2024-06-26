'use strict';

const TIMEOUT_DURATION = 5000;

const express = require('express');
let app = express();
const cookieParser = require('cookie-parser');
const jsDOM = require("jsdom");
const { JSDOM } = jsDOM;
const fs = require('fs');
const globalObject = require('./servermodules/game-modul.js');
const { type } = require('os');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use("/public", express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

http.listen(3000, function () {
    console.log("listen");
});

let x = '1';
let y = '2';

console.log(x == 1);

app.get("/", function (request, response) {

    console.log(request.method, request.query);

    if (request.cookies.nickName !== undefined && request.cookies.color !== undefined) {
        JSDOM.fromFile(__dirname + "/static/html/index.html").then(
            function (dom) {
                response.send(dom.serialize());
            },
            function () {
                console.log("Sending index.html failed");
            });
    } else {
        JSDOM.fromFile(__dirname + "/static/html/loggain.html").then(
            function (dom) {
                if (request.cookies.nickName !== undefined) {
                    dom.window.document.getElementById("nick_1").setAttribute("value", request.cookies.nickName);
                }

                if (request.cookies.color !== undefined) {
                    dom.window.document.getElementById("color_1").setAttribute("value", request.cookies.color);
                }

                response.send(dom.serialize());
            },
            function () {
                console.log("Sending loggain.html failed");
            });
    }

});

app.get("/reset", function (request, response) {

    console.log(request.method, request.query);

    if (request.cookies.nickName !== undefined || request.cookies.color !== undefined) {

        const nickname = request.cookies.nickName;
        const color = request.cookies.color
        console.log("Resetting: ", nickname, color);

        response.clearCookie("nickName");
        response.clearCookie("color");

        if (nickname == globalObject.playerOneNick || color == globalObject.playerOneColor) {
            globalObject.playerOneNick = null;
            globalObject.playerOneColor = null;
        } else if (nickname == globalObject.playerTwoNick || color == globalObject.playerTwoColor) {
            globalObject.playerTwoNick = null;
            globalObject.playerTwoColor = null;
        }
    }
    response.redirect("/");

});

app.post("/", function (request, response) {

    console.log(request.body);

    try {

        const nickname = request.body.nick_1;
        const color = request.body.color_1;

        if (nickname === undefined) {
            throw new Error("Nickname saknas!");
        }

        if (color === undefined) {
            throw new Error("Färg saknas!");
        }

        if (nickname.length < 3) {
            throw new Error("Nickname skall vara minst tre tecken långt!");
        }

        if (color.length !== 7) {
            throw new Error("Färg skall innehålla sju tecken!");
        }

        if (color === "#000000" || color === "#ffffff") {
            throw new Error("Ogiltig färg!");
        }

        // Determine if a player is unset by their name
        if (globalObject.playerOneNick == null) {
            globalObject.playerOneNick = nickname;
            globalObject.playerOneColor = color;
        } else if (globalObject.playerTwoNick == null) {
            if (nickname == globalObject.playerOneNick) {
                throw new Error("Nickname redan taget!");
            }
            if (color == globalObject.playerOneColor) {
                throw new Error("Färg redan tagen!");
            }
            globalObject.playerTwoNick = nickname;
            globalObject.playerTwoColor = color;
        } else {
            //throw new Error("Finns redan två spelare!");
            console.log("Already two players...");
        }

        response.cookie("nickName", nickname, { maxAge: h_Hours(2), httpOnly: true });
        response.cookie("color", color, { maxAge: h_Hours(2), httpOnly: true });
        response.redirect("/");

    } catch (err) {
        console.log(err.message);

        JSDOM.fromFile(__dirname + "/static/html/loggain.html").then(
            function (dom) {
                dom.window.document.getElementById("errorMsg").textContent = err.message;

                if (request.cookies.nickName !== undefined) {
                    dom.window.document.getElementById("nick_1").setAttribute("value", request.cookies.nickName);
                }

                if (request.cookies.color !== undefined) {
                    dom.window.document.getElementById("color_1").setAttribute("value", request.cookies.color);
                }

                response.send(dom.serialize());
            },
            function () {
                console.log("Sending loggain.html failed");
            });
    }

});

function h_Seconds(seconds) {
    return seconds * 1000;
}

function h_Minutes(minutes) {
    return minutes * h_Seconds(60);
}

function h_Hours(hours) {
    return hours * h_Minutes(60);
}

io.on("connection", function (socket) {
    console.log("User connected");

    let cookies = globalObject.parseCookies(socket.handshake.headers.cookie);

    if (cookies.nickName !== undefined && cookies.color !== undefined) {
        if (cookies.nickName == globalObject.playerOneNick) {
            console.log("Player 1 connected");
            globalObject.playerOneSocketId = socket.id;
        }
        else if (cookies.nickName == globalObject.playerTwoNick) {
            console.log("Player 2 connected");
            globalObject.playerTwoSocketId = socket.id;
            globalObject.resetGameArea();

            io.to(globalObject.playerOneSocketId).emit("newGame", {
                opponentNick: globalObject.playerTwoNick,
                opponentColor: globalObject.playerTwoColor,
                myColor: globalObject.playerOneColor,
            });

            io.to(globalObject.playerTwoSocketId).emit("newGame", {
                opponentNick: globalObject.playerOneNick,
                opponentColor: globalObject.playerOneColor,
                myColor: globalObject.playerTwoColor,
            });

            io.to(globalObject.playerOneSocketId).emit("yourMove", {
                cellId: null,
            });

            globalObject.currentPlayer = 1;

            clearTimeout(globalObject.timerId);
            globalObject.timerId = setTimeout(timeout, TIMEOUT_DURATION);
        }
        else {
            console.log("Redan två spelare anslutna!");
        }
    } else {
        console.log("Kakorna saknas!")
    }

    // console.log(globalObject);

    socket.on("newMove", function (data) {
        console.log("New move received", data);

        globalObject.gameArea[data.cellId] = globalObject.currentPlayer;

        if (socket.id == globalObject.playerOneSocketId) {

            globalObject.currentPlayer = 2;

            io.to(globalObject.playerTwoSocketId).emit("yourMove", {
                cellId: data.cellId,
            });

        } else if (socket.id == globalObject.playerTwoSocketId) {

            globalObject.currentPlayer = 1;

            io.to(globalObject.playerOneSocketId).emit("yourMove", {
                cellId: data.cellId,
            });
        }

        clearTimeout(globalObject.timerId);

        const result = globalObject.checkForWinner();

        // Game ended
        if (result != 0) {
            let message = "Missing message!";
            if (result == 1) {
                message = globalObject.playerOneNick + " vann!";
            } else if (result == 2) {
                message = globalObject.playerTwoNick + " vann!";
            } if (result == 3) {
                message = "Spelet blev oavgjort!";
            }
            io.emit("gameover", message);
            return;
        }

        // Game continued
        globalObject.timerId = setTimeout(timeout, TIMEOUT_DURATION);
    });

});

function timeout() {
    if (globalObject.currentPlayer == 1) {
        io.to(globalObject.playerOneSocketId).emit("timeout");
        io.to(globalObject.playerTwoSocketId).emit("yourMove", {
            cellId: null,
        });
        globalObject.currentPlayer = 2;
    }
    else if (globalObject.currentPlayer == 2) {
        io.to(globalObject.playerTwoSocketId).emit("timeout");
        io.to(globalObject.playerOneSocketId).emit("yourMove", {
            cellId: null,
        });
        globalObject.currentPlayer = 1;
    }
    clearTimeout(globalObject.timerId);
    globalObject.timerId = setTimeout(timeout, TIMEOUT_DURATION);
}
