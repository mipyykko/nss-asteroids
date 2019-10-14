"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const game_1 = require("./game");
const app = express_1.default();
const port = process.env.PORT || 4000;
app.set("port", port);
const server = new http_1.default.Server(app);
const io = socket_io_1.default(server);
class Server {
    start() {
        server.listen(port, () => {
            console.log(`Listening on ${port}`);
        });
        this.game = new game_1.Game(io);
        this.game.start();
    }
}
(new Server()).start();
//# sourceMappingURL=server.js.map