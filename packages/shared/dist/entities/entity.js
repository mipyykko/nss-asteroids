"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let runningId = 0;
class Entity {
    constructor(props) {
        const { id, x, y, heading, velocityX, velocityY, rotation, ownerId, type, subtype, gameWidth, gameHeight, } = props;
        this.id = id ? id : runningId++;
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.rotation = rotation;
        this.ownerId = ownerId;
        this.type = type;
        this.subtype = subtype;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }
    setValues(values) {
        const { x, y, heading, velocityX, velocityY, rotation, subtype } = values;
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.rotation = rotation;
        this.subtype = subtype;
    }
    baseUpdate() {
        this.heading += this.rotation;
        this.x += this.velocityX;
        this.y -= this.velocityY;
        if (this.x < 0) {
            this.x += this.gameWidth;
        }
        if (this.y < 0) {
            this.y += this.gameHeight;
        }
        if (this.x > this.gameWidth) {
            this.x = this.x % this.gameWidth;
        }
        if (this.y > this.gameHeight) {
            this.y = this.y % this.gameHeight;
        }
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map