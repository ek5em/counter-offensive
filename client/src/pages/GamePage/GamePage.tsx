import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import { useEffect, useState } from "react";
import "./GamePage.css"
import {TKeyboard, TPoint } from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";


type TCheckBorder = {
    up: boolean, 
    down: boolean, 
    right?: boolean, 
    left?: boolean
}

type TUnit = TPoint & {
    r: number
}

const GamePage: React.FC = () => {

    const height = window.innerHeight - 26;
    const width = window.innerWidth - 26;
    const prop = width / height;
    const WIN = {
        left: -10 * prop,
        bottom: -10,
        width: 20 * prop,
        height: 20,
    };

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    
    const speedInfantry = 1/16;

    const borderScena: TPoint[] = [{x: 10, y: 20}, {x: -10, y: 20}, {x: -10, y: -20}, {x: 10, y: -20}] 

    const tank: TPoint[] = [{x:-0.5, y:-0.7}, {x:0.5, y:-0.7}, {x:0.5, y:0.7}, {x:-0.5, y:0.7}] 
    const man: TUnit = {x: 0, y: 0, r: 30} 

    useEffect(() => {
        canvas = Canvas({
            id: 'canvas',
            width: width,
            height: height,
            WIN: WIN,
            callbacks: {
                keydown: (event) => {keyDown(event)},
                keyup: (event) => {keyUp(event)}
            }
        });

        return () => {
            canvas.clearRect();
        };
    }, [])


    const keyDown = (event: KeyboardEvent) => {
        if (event.code ==='ArrowUp' || event.code ==='KeyW') { 
            keyPressed.ArrowUp = true
        }
        if (event.code ==='ArrowDown' || event.code ==='KeyS') { 
            keyPressed.ArrowDown = true
        }
        if (event.code ==='ArrowRight' || event.code ==='KeyD') { 
            keyPressed.ArrowRight = true    
        }
        if (event.code ==='ArrowLeft' || event.code ==='KeyA') { 
            keyPressed.ArrowLeft = true    
        }       
    }

    const keyUp = (event: KeyboardEvent) => {
        if (event.code ==='ArrowUp' || event.code ==='KeyW') { 
            keyPressed.ArrowUp = false
        }
        if (event.code ==='ArrowDown' || event.code ==='KeyS') { 
            keyPressed.ArrowDown = false   
        }
        if (event.code ==='ArrowRight' || event.code ==='KeyD') { 
            keyPressed.ArrowRight = false    
        }
        if (event.code ==='ArrowLeft' || event.code ==='KeyA') { 
            keyPressed.ArrowLeft = false    
        }       
    }
    
    /* движение пехотинца по карте */
    const moveSceneInfantry = (keyPressed: TKeyboard, canMove:TCheckBorder) => {
        const diagonalSpeed = speedInfantry * Math.sqrt(2) / 2;
        let speed = 0;
        if (keyPressed.ArrowUp && keyPressed.ArrowLeft || keyPressed.ArrowUp && keyPressed.ArrowRight ||
             keyPressed.ArrowDown && keyPressed.ArrowRight || keyPressed.ArrowDown && keyPressed.ArrowLeft) speed = diagonalSpeed 
        else speed = speedInfantry  
        
        if(keyPressed.ArrowUp && canMove.up) {
            WIN.bottom += speed;
        } 
        if(keyPressed.ArrowDown && canMove.down) {
            WIN.bottom -= speed;
        }
        if (keyPressed.ArrowLeft && canMove.left) {
            WIN.left -= speed;
        }
        if (keyPressed.ArrowRight && canMove.right) {
            WIN.left += speed;
        }  
        canvas.man(man, 'yellow', man.r)
    }

    const checkBorderInfantry = ():TCheckBorder  => {
        let canMove = {up: true, down: true, right: true, left: true}
        if (canvas.notxs(man.x) +  man.r > canvas.xs(borderScena[0].x)) canMove.right = false
        if (canvas.notxs(man.x) -  man.r < canvas.xs(borderScena[2].x)) canMove.left = false
        if (canvas.notys(man.y) -  man.r < canvas.ys(borderScena[0].y)) canMove.up = false
        if (canvas.notys(man.y) +  man.r > canvas.ys(borderScena[2].y)) canMove.down = false

        return canMove
    }

    const renderScene = (FPS: number) => {
        if (canvas) {
            setShowFPS(FPS);
            
            canvas.clear();

            canvas.border(borderScena, '#777', "red")

            canvas.line(-100, -100, 100, 100, 2,'#66a')
            canvas.line(-100, 100, 100, -100, 2,'#66a')
            canvas.line(-100, 0, 100, 0, 2,'#66a')
            canvas.line(0, 100, 0, -100, 2,'#66a')
            
            moveSceneInfantry(keyPressed, checkBorderInfantry())
        }
    }

    return(
        <div className="game_page">
            <canvas id="canvas"></canvas>
            <span className="fps">FPS: {FPS}</span>
        </div>
       
    )    
}

export default GamePage;