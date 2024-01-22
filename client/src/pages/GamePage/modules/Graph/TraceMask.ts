import { MAP_SIZE, WINConf, objectConf, walls } from "../../../../config";
import { EMapObject, IMapObject } from "../../../../modules/Server/interfaces";
import { TPoint, TUnit, TWIN } from "../../types";
import Canvas from "./Canvas/Canvas";
import Infantry from "../Game/Units/Infantry";
import { IGameScene } from "../Game/Game";
import { Mediator } from "../../../../modules";

interface ITraceMaskProps {
   canvas: Canvas;
   WIN: TWIN;
   height: number;
   width: number;
   cellSize: number;
   mediator: Mediator
}

export default class TraceMask {
   canvas: Canvas;
   WIN: TWIN;
   maskCanv: HTMLCanvasElement;
   maskContext: CanvasRenderingContext2D;
   traceCanv: HTMLCanvasElement;
   traceContext: CanvasRenderingContext2D;
   cellSize: number;
   pixelScene: ImageData | null;

   constructor({ WIN, canvas, height, width, cellSize, mediator}: ITraceMaskProps) {
      this.WIN = WIN;
      this.canvas = canvas;
      this.cellSize = cellSize;

        this.maskCanv = document.createElement("canvas");
        this.maskContext = this.maskCanv.getContext(
            "2d"
        ) as CanvasRenderingContext2D;

      this.traceCanv = document.createElement("canvas");
      this.traceContext = this.traceCanv.getContext(
         "2d"
      ) as CanvasRenderingContext2D;

      this.maskCanv.width = (MAP_SIZE.width + 2) * cellSize;
      this.maskCanv.height = (MAP_SIZE.height + 2)* cellSize;

      this.traceCanv.width = width;
      this.traceCanv.height = height;

      const {UPDATE_SCENE} = mediator.getTriggerTypes()
      mediator.set(UPDATE_SCENE, (scena: IMapObject[]) => {
         this.drawScene(scena)
         this.pixelScene = this.getMaskImage()
      })

      this.pixelScene = null;
   }

   xs(x: number): number {
      return (x + 1) * this.cellSize;
   }

   ys(y: number): number {
      return this.maskCanv.height - (y + 1) * this.cellSize;
   }

   polygon(points: TPoint[], color: string = "#f00"): void {
      if (points.length >= 3) {
         this.maskContext.fillStyle = color;
         this.maskContext.beginPath();
         this.maskContext.moveTo(
            this.xs(points[0].x),
            this.ys(points[0].y)
         );
         for (let i = 1; i < points.length; i++) {
            this.maskContext.lineTo(
               this.xs(points[i].x),
               this.ys(points[i].y)
            );
         }
         this.maskContext.lineTo(
            this.xs(points[0].x),
            this.ys(points[0].y)
         );
         this.maskContext.closePath();
         this.maskContext.fill();
      }
   }

   circle(circle: TPoint & { r: number }, color = "#f00"): void {
      this.maskContext.beginPath();
      this.maskContext.arc(
         this.xs(circle.x),
         this.ys(circle.y),
         (circle.r * this.cellSize),
         0,
         2 * Math.PI
      );
      this.maskContext.fillStyle = color;
      this.maskContext.fill();
      this.maskContext.closePath();
   }

   drawScene(scene: IMapObject[]) {
      this.maskContext.beginPath();
      this.maskContext.fillStyle = "#000f";
      this.maskContext.fillRect(
         this.cellSize,
         this.cellSize,
         this.maskCanv.width,
         this.maskCanv.height
      );

      walls.forEach((wall) => {
         this.polygon(wall)
      })
    
      scene.forEach((obj) => {
         const { x, y, sizeX: dx, sizeY: dy } = obj;
         const { stone, bush, tree} = objectConf;
         console.log(stone)
         switch (obj.type) {
            case EMapObject.house: {
               this.polygon([
                  { x, y },
                  { x: x + dx, y },
                  { x: x + dx, y: y - dy },
                  { x, y: y - dy },
               ]);
               break;
            }
            case EMapObject.stone: {
               this.circle({ x: x, y: y, r: stone.r });
               break;
            }

            case EMapObject.bush: {
               this.circle({ x: x, y: y, r: bush.r });
               break;
            }

            case EMapObject.tree: {
               this.circle({ x: x + tree.r, y: y - tree.r, r: tree.r });
            }
         }
      });
      this.maskContext.closePath();
   }

   getMaskImage(): ImageData {
      return this.maskContext.getImageData(
         0,
         0,
         this.maskCanv.width,
         this.maskCanv.height
      );
   }

   lineBrezen(start: TPoint, end: TPoint, pixelscene: ImageData, offsetMask: TPoint): TPoint {
      const coef = 1;
      const w = pixelscene.width;

        let isObject = false;
        let isVisiable = true;

      let x1 = Math.floor(this.canvas.xs(start.x));
      let y1 =  Math.floor(this.canvas.ys(start.y));
      let x2 = this.canvas.xs(end.x);
      let y2 = this.canvas.ys(end.y);

      const dx = Math.abs(x2 - x1);
      const sx = x1 < x2 ? 1 : -1;
      const dy = -Math.abs(y2 - y1);
      const sy = y1 < y2 ? 1 : -1;
      let n = dx > -dy ? coef * dx : -coef * dy;
      let error = dx + dy;
      for (; n > 0; n--) {
         if (isVisiable) {
            const pixelRed = pixelscene.data[(y1 + offsetMask.y) * (w * 4) + (offsetMask.x + x1) * 4];

            if (
               isObject && pixelRed === 0 ||
               x1 < 0 ||
               y1 < 0 ||
               x1 > this.maskCanv.width ||
               y1 > this.maskCanv.height
            ) {
               isVisiable = false;
               isObject = false;
               return { x: x1 - sx, y: y1 - sy };
            }
            if (pixelRed === 255) {
               isObject = true;
            }
         }
         const err2 = 2 * error;
         if (err2 > dy) {
            error += dy;
            x1 += sx;
         }
         if (err2 < dx) {
            error += dx;
            y1 += sy;
         }
      }

        if (isVisiable) {
            return { x: x1 + sx, y: y1 + sy };
        }
        return { x: this.canvas.xs(start.x), y: this.canvas.ys(start.y) };
    }

   drawTrace(area: TPoint[]) {
      this.traceContext.clearRect(0, 0, this.traceCanv.width, this.traceCanv.height)
      this.traceContext.fillStyle = "#333333fe";
      this.traceContext.fillRect(0, 0, this.traceCanv.width, this.traceCanv.height);

      this.traceContext.globalCompositeOperation = 'destination-out'

      this.traceContext.fillStyle = "#fff";
      this.traceContext.beginPath();
      this.traceContext.moveTo(area[0].x, area[0].y);
      for (let i = 1; i < area.length; i++) { 
         this.traceContext.lineTo(area[i].x, area[i].y);
      }
      this.traceContext.lineTo(area[0].x, area[0].y);
      this.traceContext.fill();

      this.traceContext.globalCompositeOperation = 'source-over'

      this.traceContext.closePath();
   }

   trace(unit: TUnit, WIN: TWIN) {
      if (this.pixelScene) {

         const offsetMask: TPoint = {
            x: Math.floor(this.xs(WIN.left)), 
            y: Math.floor(this.ys(WIN.bottom + WINConf.height))
         }
         const areaVisible: TPoint[] = [
            {
               x: this.canvas.xs(unit.x),
               y: this.canvas.ys(unit.y),
            },
         ];

         const oneDegree = Math.PI / 180;
         const angle = unit.visiableAngle / 2;
         for (let i = -angle; i <= angle; i++) {
            const end = {
               x:
                  unit.x +
                  Math.cos(unit.angle + i * oneDegree) * unit.visionDistance,
               y:
                  unit.y +
                  Math.sin(unit.angle + i * oneDegree) * unit.visionDistance,
            };

            areaVisible.push(
               this.lineBrezen({ x: unit.x, y: unit.y }, end, this.pixelScene, offsetMask)
            );
         }

         areaVisible.push(
            {
               x: this.canvas.xs(unit.x),
               y: this.canvas.ys(unit.y),
            },
         );

         this.drawTrace(areaVisible);
         
         this.canvas.drawImage(this.traceCanv, 0, 0);
      }
   }
}
