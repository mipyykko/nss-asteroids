"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("shared/src/models");
const entity_1 = require("./entity");
const Vec2D = __importStar(require("vector2d"));
class AsteroidEntity extends entity_1.Entity {
    constructor(props) {
        const { width, height, subtype } = props;
        const heading = Math.random() * 360;
        const velocity = new Vec2D.Vector(Math.cos(heading) * Math.random(), Math.sin(heading) * Math.random());
        super({
            type: models_1.EntityType.ASTEROID,
            position: new Vec2D.Vector(Math.random() * width, Math.random() * height),
            subtype,
            heading,
            velocity,
            rotation: Math.random(),
        });
    }
    update() {
        this.heading += this.rotation;
        this.position.add(this.velocity);
    }
}
exports.AsteroidEntity = AsteroidEntity;
//# sourceMappingURL=asteroid.js.map