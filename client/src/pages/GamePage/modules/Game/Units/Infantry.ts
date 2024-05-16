import { TPressedKeys } from "../Game";
import BaseUnit from "./BaseUnit";

export default class Infantry extends BaseUnit {
    diagonalSpeed: number;

    constructor(
        x = 5,
        y = 5,
        angle = 0,
        r = 0.35,
        speed = 0.005,
        weaponLength = 0.6,
        visiableAngle = 120
    ) {
        super(x, y, angle, r, speed, weaponLength, visiableAngle);
        this.diagonalSpeed = (this.speed * Math.sqrt(2)) / 2;
    }

    move(keyPressed: TPressedKeys, time: number) {
        const speed =
            time *
            ((keyPressed.Up && keyPressed.Left) ||
            (keyPressed.Up && keyPressed.Right) ||
            (keyPressed.Down && keyPressed.Right) ||
            (keyPressed.Down && keyPressed.Left)
                ? this.diagonalSpeed
                : this.speed);

        if (keyPressed.Up) {
            this.y += speed;
        }
        if (keyPressed.Down) {
            this.y -= speed;
        }
        if (keyPressed.Left) {
            this.x -= speed;
        }
        if (keyPressed.Right) {
            this.x += speed;
        }
    }

    rotate(angle: number) {
        this.angle = angle;
    }
}
