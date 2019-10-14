"use strict";
exports.__esModule = true;
var react_1 = require("react");
var socketIOClient = require("socket.io-client");
var App = function () {
    var _a = react_1.useState(), socket = _a[0], setSocket = _a[1];
    var connect = function () {
        setSocket(socketIOClient.connect("http://localhost:4000"));
    };
    return (<div>
      <button onClick={function () { return socket ? connect() : setSocket(undefined); }}>{socket ? "Disconnect" : "Connect"}</button>
    </div>);
};
exports["default"] = App;
