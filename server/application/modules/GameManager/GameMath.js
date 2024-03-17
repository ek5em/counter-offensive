class GameMath {
    calculateAngle(x1, y1, x2, y2) {
        return Math.atan2(y1 - y2, x1 - x2);
    }

    movePoint(x, y, angle, distance) {
        let newX = x + distance * Math.cos(angle);
        let newY = y + distance * Math.sin(angle);
    
        return [newX, newY];
    }

    calculateShiftPoint(x1, y1, x2, y2, distance) {
        let dx = x2 - x1;
        let dy = y2 - y1;
    
        let distanceBetweenPoints = Math.sqrt(dx * dx + dy * dy);
    
        let factor = distance / distanceBetweenPoints;
    
        return [x1 + dx * factor, y1 + dy * factor];
    }

    calculateDistance(x1, x2, y1, y2){
        return Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2));
    }

    shootReg(x, y, x1, y1, x2, y2, area) {
        
        let A = x - x1;
        let B = y - y1;
        let C = x2 - x1;
        let D = y2 - y1;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) {
                param = dot / len_sq;
        }
        let {xx, yy} = 0;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        let dx = x - xx;
        let dy = y - yy;
        let sqrt = Math.sqrt(dx * dx + dy * dy);
        if (sqrt <= area){
            return x * x1 + y * y1;
        }
        return false;
        
    }
}

module.exports = GameMath;