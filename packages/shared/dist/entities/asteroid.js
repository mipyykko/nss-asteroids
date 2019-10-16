"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const entity_1 = require("./entity");
class AsteroidEntity extends entity_1.Entity {
    constructor(props) {
        const { gameWidth, gameHeight, subtype } = props;
        const heading = Math.random() * 360;
        const velocityX = Math.sin(heading) * Math.random();
        const velocityY = Math.cos(heading) * Math.random();
        super({
            type: models_1.EntityType.ASTEROID,
            x: Math.random() * gameWidth,
            y: Math.random() * gameHeight,
            subtype,
            heading,
            velocityX,
            velocityY,
            rotation: Math.random() * 0.4 - 0.2,
            gameWidth,
            gameHeight,
        });
    }
    update() {
        this.baseUpdate();
    }
}
exports.AsteroidEntity = AsteroidEntity;
//# sourceMappingURL=asteroid.js.map