"use strict";
exports.__esModule = true;
var InputEventType;
(function (InputEventType) {
    InputEventType[InputEventType["LEFT"] = 0] = "LEFT";
    InputEventType[InputEventType["RIGHT"] = 1] = "RIGHT";
    InputEventType[InputEventType["THRUST"] = 2] = "THRUST";
    InputEventType[InputEventType["FIRE"] = 3] = "FIRE";
})(InputEventType = exports.InputEventType || (exports.InputEventType = {}));
var EventType;
(function (EventType) {
    EventType["SERVER_STATE"] = "serverstate";
    EventType["PLAYER_JOIN"] = "playerjoin";
    EventType["PLAYER_PART"] = "playerpart";
    EventType["PLAYER_INPUT"] = "playerinput";
    EventType["PLAYER_UPDATE"] = "playerupdate";
    EventType["CONNECTION"] = "connection";
    EventType["DISCONNECT"] = "disconnect";
})(EventType = exports.EventType || (exports.EventType = {}));
var EntityType;
(function (EntityType) {
    EntityType[EntityType["SHIP"] = 0] = "SHIP";
    EntityType[EntityType["ASTEROID"] = 1] = "ASTEROID";
    EntityType[EntityType["SHOT"] = 2] = "SHOT";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
var ShipSubType;
(function (ShipSubType) {
})(ShipSubType = exports.ShipSubType || (exports.ShipSubType = {}));
var AsteroidSubType;
(function (AsteroidSubType) {
    AsteroidSubType[AsteroidSubType["LARGE"] = 0] = "LARGE";
    AsteroidSubType[AsteroidSubType["MEDIUM"] = 1] = "MEDIUM";
    AsteroidSubType[AsteroidSubType["SMALL"] = 2] = "SMALL";
})(AsteroidSubType = exports.AsteroidSubType || (exports.AsteroidSubType = {}));
var ShotSubType;
(function (ShotSubType) {
})(ShotSubType = exports.ShotSubType || (exports.ShotSubType = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["PAUSED"] = 0] = "PAUSED";
    GameStatus[GameStatus["RUNNING"] = 1] = "RUNNING";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
