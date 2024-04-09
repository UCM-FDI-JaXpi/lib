"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var queue_typescript_1 = require("queue-typescript");
var axios = require('axios');
var parentPort = require('worker_threads').parentPort;
var queue = new queue_typescript_1.Queue();
// Escuchar mensajes del hilo principal
parentPort.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var url, statementQueue, length, queue_id, i, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = message.url, statementQueue = message.statementQueue, length = message.length, queue_id = message.queue_id;
                // console.log('Tipo de statementQueue:', typeof statementQueue)
                // console.log('cola:', statementQueue)
                statementQueue.forEach(function (item) {
                    queue.enqueue(item);
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < length)) return [3 /*break*/, 5];
                // console.log(queue.head)
                return [4 /*yield*/, sendStatement(url, queue.head)];
            case 3:
                // console.log(queue.head)
                _a.sent();
                queue.removeHead();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                // console.log("El envío ha terminado, todas las trazas han sido enviadas");
                parentPort.postMessage({ log: 'Todas las trazas han sido enviadas', queue_id: queue_id });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error("Error al enviar las trazas:", error_1.code);
                //parentPort.error(error)
                parentPort.postMessage({ error: error_1.code }); // Propaga el error para manejarlo en el código principal si es necesario
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
function sendStatement(url, statement) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post(url, statement, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })];
                case 1:
                    response = _a.sent();
                    console.log("Respuesta del servidor: ".concat(response.status, "\n para la traza ").concat(statement.verb.display["en-us"], ".").concat(statement.object.definition.name["en-us"]));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    // console.error('Error al enviar la traza:', error);
                    throw error_2; // Propaga el error para manejarlo en el código principal si es necesario
                case 3: return [2 /*return*/];
            }
        });
    });
}
