import { TPressedKeys } from "../Game";
import BaseUnit from "./BaseUnit";

export default class MiddleTower extends BaseUnit {
    constructor(
        x = 5,
        y = 5,
        angle = 0,
        r = 0,
        speed = Math.PI / 180,
        weaponLength = 1,
        visiableAngle = 45
    ) {
        super(x, y, angle, r, speed, weaponLength, visiableAngle);
    }

    move(keyPressed: TPressedKeys, time: number) {
        if (keyPressed.Left) {
            this.angle += this.speed * time;
        }
        if (keyPressed.Right) {
            this.angle -= this.speed * time;
        }
        this.angle = this.angle % (Math.PI * 2);
    }

    rotate(angle: number): void {
        return;
    }
}
