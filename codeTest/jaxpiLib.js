"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var traceGeneratorTest_1 = require("./traceGeneratorTest");
var JaxpiLib = /** @class */ (function () {
    function JaxpiLib(player, url) {
        this.player = player;
        this.url = url;
    }
    JaxpiLib.prototype.start = function (account) {
        var json = (0, traceGeneratorTest_1.logStatement)("logIn", account, this.player);
        console.log(json.object.definition.description["es"]);
        axios_1.default.post(this.url, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // En caso de éxito, imprime la respuesta del servidor
            .then(function (response) {
            console.log('Respuesta:', response.data);
        })
            // En caso de error, lo imprime
            .catch(function (error) {
            console.error('Error al enviar la traza JaXpi:', error.message);
        });
    };
    JaxpiLib.prototype.advance = function (verb, object) {
        var json = (0, traceGeneratorTest_1.createStatement)(verb, object, this.player);
        axios_1.default.post(this.url, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // En caso de éxito, imprime la respuesta del servidor
            .then(function (response) {
            console.log('Respuesta:', response.data);
        })
            // En caso de error, lo imprime
            .catch(function (error) {
            console.error('Error al enviar la traza JaXpi:', error.message);
        });
    };
    JaxpiLib.prototype.end = function (account) {
        var json = (0, traceGeneratorTest_1.logStatement)("logOut", account, this.player);
        axios_1.default.post(this.url, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // En caso de éxito, imprime la respuesta del servidor
            .then(function (response) {
            console.log('Respuesta:', response.data);
        })
            // En caso de error, lo imprime
            .catch(function (error) {
            console.error('Error al enviar la traza JaXpi:', error.message);
        });
    };
    JaxpiLib.prototype.actorUpdate = function (player) {
        this.player = player;
    };
    return JaxpiLib;
}());
var jaxpi = new JaxpiLib({ name: "1", mail: "m", id: "b", accountId: "x" }, "http://localhost:3000");
jaxpi.start("account");
