"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const entity_1 = require("./entity");
const rotatePoint = (x, y, rad) => {
    const rcos = Math.cos(rad);
    const rsin = Math.sin(rad);
    return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
};
const VELOCITY = 0.1;
const MAX_DISTANCE = 10;
class ShotEntity extends entity_1.Entity {
    constructor(props) {
        const { x, y, heading } = props;
        const origin = rotatePoint(x + 10, y, heading);
        super(Object.assign(Object.assign({}, props), { id: undefined, type: models_1.EntityType.SHOT, subtype: undefined, x: origin.x, y: origin.y, rotation: 0.0 }));
        this.velocityX = Math.sin(heading * 0.01745) * VELOCITY;
        this.velocityY = Math.sin(heading * 0.01745) * VELOCITY;
        this.distanceTravelled = 0.0;
        this.dead = false;
    }
    update() {
        this.baseUpdate();
        // console.log(this.distanceTravelled)
        this.distanceTravelled += VELOCITY;
        if (this.distanceTravelled > MAX_DISTANCE) {
            this.dead = true;
        }
    }
}
exports.ShotEntity = ShotEntity;
//# sourceMappingURL=shot.js.map