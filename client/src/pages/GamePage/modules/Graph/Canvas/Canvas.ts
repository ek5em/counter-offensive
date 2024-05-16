import { TPoint, TWIN, TCircle } from "../../../types";

export interface ICanvasOption {
    WIN: TWIN;
    width: number;
    height: number;
    id: string;
    callbacks: {
        keydown: (e: KeyboardEvent) => void;
        keyup: (e: KeyboardEvent) => void;
        mousemove: (e: MouseEvent) => void;
        mouseUp: () => void;
        mouseDown: () => void;
    };
}

class Canvas {
    WIN: TWIN;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    canvasV: HTMLCanvasElement;
    contextV: CanvasRenderingContext2D;

    canvasTrace: HTMLCanvasElement;
    contextTrace: CanvasRenderingContext2D;
    areaVisible: TPoint[];

    constructor({ WIN, id, height, width, callbacks }: ICanvasOption) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.canvasV = document.createElement("canvas");
        this.contextV = this.canvasV.getContext(
            "2d"
        ) as CanvasRenderingContext2D;

        this.canvasTrace = document.createElement("canvas");
        this.contextTrace = this.canvasTrace.getContext("2d", {
            willReadFrequently: true,
        }) as CanvasRenderingContext2D;

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasV.width = width;
        this.canvasV.height = height;

        this.WIN = WIN;
        this.areaVisible = [];

        const { keydown, keyup, mousemove, mouseDown, mouseUp } = callbacks;

        window.addEventListener("keydown", keydown);
        window.addEventListener("keyup", keyup);
        window.addEventListener("mousemove", mousemove);
        this.canvas.addEventListener("mousedown", mouseDown);
        this.canvas.addEventListener("mouseup", mouseUp);

        window.addEventListener(
            "contextmenu",
            (event: Event) => {
                event.preventDefault();
            },
            false
        );
    }
    // переходи из Декартовой системы в Канвасную
    xs(x: number): number {
        return ((x - this.WIN.left) / this.WIN.width) * this.canvas.width;
    }

    ys(y: number): number {
        return (
            this.canvas.height -
            ((y - this.WIN.bottom) / this.WIN.height) * this.canvas.height
        );
    }

    // переходи из Канвасной системы в Декартову

    sx(xs: number): number {
        return (xs * this.WIN.width) / this.canvas.width + this.WIN.left;
    }

    sy(ys: number): number {
        return (
            (-ys * this.WIN.height) / this.canvas.height +
            this.WIN.bottom +
            this.WIN.height
        );
    }

    point(x: number, y: number, color = "#c00000", size = 2): void {
        this.contextV.beginPath();
        this.contextV.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.contextV.fillStyle = color;
        this.contextV.fill();
        this.contextV.closePath();
    }

    line(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        width = 1,
        color: string
    ): void {
        this.contextV.beginPath();
        this.contextV.moveTo(this.xs(x1), this.ys(y1));
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.setLineDash([]);
        this.contextV.lineTo(this.xs(x2), this.ys(y2));
        this.contextV.stroke();
        this.contextV.closePath();
    }

    polygon(points: TPoint[], color: string = "#ff0"): void {
        this.contextV.beginPath();
        this.contextV.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.contextV.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.contextV.fillStyle = color;
        this.contextV.fill();
        this.contextV.closePath();
    }

    circle(circle: TCircle, color = "#00f"): void {
        this.contextV.beginPath();
        this.contextV.arc(
            this.xs(circle.x),
            this.ys(circle.y),
            (circle.r * this.canvas.width) / this.WIN.width,
            0,
            2 * Math.PI
        );
        this.contextV.fillStyle = color;
        this.contextV.fill();
        this.contextV.closePath();
    }

    sprite(
        image: HTMLImageElement,
        dx: number,
        dy: number,
        dSize: number,
        sx: number,
        sy: number,
        sSize: number
    ) {
        if (dSize && sx >= 0 && sy >= 0 && sSize) {
            this.contextV.drawImage(
                image,
                sx,
                sy,
                sSize,
                sSize,
                this.xs(dx),
                this.ys(dy),
                dSize,
                dSize
            );
            return;
        }
        if (dSize) {
            this.contextV.drawImage(
                image,
                this.xs(dx),
                this.ys(dy),
                dSize,
                dSize
            );
            return;
        }
        this.contextV.drawImage(image, this.xs(dx), this.ys(dy));
    }

    spriteDir(
        image: HTMLImageElement,
        dx: number,
        dy: number,
        dSize: number,
        sx: number,
        sy: number,
        sSize: number,
        direction: number
    ) {
        if (direction) {
            const xs = this.xs(dx);
            const ys = this.ys(dy);
            const transX = xs + dSize / 2;
            const transY = ys + dSize / 2;
            this.contextV.save();
            this.contextV.translate(transX, transY);
            this.contextV.rotate((direction * Math.PI) / 180);
            this.contextV.translate(-transX, -transY);
            this.contextV.drawImage(
                image,
                sx,
                sy,
                sSize,
                sSize,
                xs,
                ys,
                dSize,
                dSize
            );
            this.contextV.restore();
            return;
        }
        this.sprite(image, dx, dy, dSize, sx, sy, sSize);
    }

    spriteMap(
        image: HTMLImageElement,
        dx: number,
        dy: number,
        dSize: number,
        sx: number,
        sy: number,
        sSize: number
    ) {
        if (dSize && sx >= 0 && sy >= 0 && sSize) {
            this.contextV.drawImage(
                image,
                sx,
                sy,
                sSize,
                sSize,
                this.xs(dx),
                this.ys(dy),
                dSize,
                dSize
            );
            return;
        }
        if (dSize) {
            this.contextV.drawImage(
                image,
                this.xs(dx),
                this.ys(dy),
                dSize,
                dSize
            );
            return;
        }
        this.contextV.drawImage(image, this.xs(dx), this.ys(dy));
    }

    clear() {
        this.contextV.fillStyle = "#333f";
        this.contextV.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    printText(text: string, x: number, y: number, color = "black", size = 12) {
        this.contextV.font = `${size}px serif`;
        this.contextV.fillStyle = color;
        this.contextV.fillText(text, this.xs(x), this.ys(y));
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number) {
        this.contextV.drawImage(image, dx, dy);
    }

    render() {
        this.context.drawImage(this.canvasV, 0, 0);
    }
}

export default Canvas;
