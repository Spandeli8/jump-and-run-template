import { Rectangle } from "./Rectangle.js";
import { gameWidth, gameHeight } from "./canvas.js";
import { objects, objectsOfType } from "./objects.js";

export class Box extends Rectangle {
    constructor(options, type) {
        const { pos, size, color, grav, friction, vel } = options;
        super({ pos, size, color }, type || "Box");
        this.grav = grav || 0.005;
        this.friction = friction || 0;
        this.vel = vel ? vel : [0, 0];
        this.acc = 0;
        this.onGround = false;
        this.ppos = [...pos];
    }

    get prevLeft() {
        return this.ppos[0];
    }

    get prevRight() {
        return this.ppos[0] + this.size[0];
    }

    get prevTop() {
        return this.ppos[1];
    }

    get prevBottom() {
        return this.ppos[1] + this.size[1];
    }

    applyPhysics(deltaTime) {
        this.vel[0] += this.acc * deltaTime;
        this.vel[0] *= 1 - this.friction;
        this.vel[1] += this.grav * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;
        this.pos[0] += this.vel[0] * deltaTime;
        this.onGround = false;
    }

    update(deltaTime) {
        this.ppos = [...this.pos];
        this.applyPhysics(deltaTime);
        objects.forEach((obj) => {
            this.collideWith(obj).fromAbove();
            this.collideWith(obj).fromBelow();
            this.collideWith(obj).fromLeft();
            this.collideWith(obj).fromRight();
        });
        this.specificUpdate();
        this.boundToCanvas();
    }

    specificUpdate() {
        return;
    }

    boundToCanvas() {
        if (this.bottom >= gameHeight) {
            this.vel[1] = 0;
            this.setBottom(gameHeight);
            this.onGround = true;
        }
        if (this.left <= 0) {
            this.setLeft(0);
            this.vel[0] = 0;
        } else if (this.right >= gameWidth) {
            this.setRight(gameWidth);
            this.vel[0] = 0;
        }
    }

    push() {
        return {
            toLeft: () => false,
            toRight: () => false,
        };
    }

    collideWith(obj) {
        return {
            fromLeft: () => {
                if (this.prevRight <= obj.left && this.overlapsWith(obj)) {
                    if (this.push(obj).toRight()) return;
                    this.setRight(obj.left);
                    this.vel[0] = 0;
                }
            },
            fromRight: () => {
                if (this.prevLeft >= obj.right && this.overlapsWith(obj)) {
                    if (this.push(obj).toLeft()) return;
                    this.setLeft(obj.right);
                    this.vel[0] = 0;
                }
            },
            fromAbove: () => {
                if (this.prevBottom <= obj.top && this.overlapsWith(obj)) {
                    this.setBottom(obj.top);
                    this.vel[1] = 0;
                    this.onGround = true;
                }
            },
            fromBelow: () => {
                if (this.prevTop >= obj.bottom && this.overlapsWith(obj)) {
                    this.setTop(obj.bottom);
                    this.vel[1] = 0;
                }
            },
        };
    }

    canBeMovedBy(vector) {
        if (
            this.left + vector[0] < 0 ||
            this.right + vector[0] > gameWidth ||
            this.top + vector[1] < 0 ||
            this.bottom + vector[1] > gameHeight
        )
            return false;
        return [...objectsOfType.Box, ...objectsOfType.Rectangle].every(
            (obj) => !this.overlapsWith(obj, vector)
        );
    }

    getDistanceToRightObject() {
        let d = gameWidth - this.right;
        [...objectsOfType.Box, ...objectsOfType.Rectangle].forEach((obj) => {
            if (this.right <= obj.left && this.bottom > obj.top && this.top < obj.bottom)
                d = Math.min(d, obj.left - this.right);
        });
        return d;
    }

    getDistanceToLeftObject() {
        let d = this.left;
        [...objectsOfType.Box, ...objectsOfType.Rectangle].forEach((obj) => {
            if (this.left >= obj.right && this.bottom > obj.top && this.top < obj.bottom)
                d = Math.min(d, this.left - obj.right);
        });
        return d;
    }
}
