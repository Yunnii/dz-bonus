/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 12/1/12
 * Time: 3:35 AM
 * To change this template use File | Settings | File Templates.
 */
/*global R: true*/

(function (exports) {
    "use strict";

    var Ball = function (paper, x, y, r) {
        this.r = r;
        this.circle = paper.circle(x, y, r).attr({fill: "#66e", "stroke-width": 2});
        this.areaRadius = r + 30;
    };

    function getCircleToPath(x, y, r) {
        var s = "M";
        s = s + (x) + "," + (y - r) + "A" + r + "," + r + ",0,1,1," + (x - 0.1) + "," + (y - r) + "z";
        return s;
    }

    exports.Ball = Ball;

    Ball.prototype.SetXY = function (x, y) {
        this.circle.attrs.cx = x;
        this.circle.attrs.cy = y;
    };

    Ball.prototype.X = function () { return this.circle.attrs.cx; };
    Ball.prototype.Y = function () { return this.circle.attrs.cy; };
    Ball.prototype.circleString = function () { return getCircleToPath(this.X(), this.Y(), this.r); };

    var speed = 50;

    Ball.prototype.moveBall = function (x, y) {

        var center = {X : this.X(), Y: this.Y()},
            tangens = (x - center.X === 0) ? 0 : (y - center.Y) / (x - center.X),
            nextX,
            nextY;

        if (x - center.X === 0) {
            nextX = center.X;
            nextY = (y - center.Y > 0) ? center.Y - speed :
                    center.Y + speed;
        } else {
            nextX = (x - center.X > 0) ? center.X - speed :
                    center.X + speed;
            nextY = tangens * nextX + (center.Y - tangens * center.X);
            if (Math.abs(tangens) > 1.1) {
                nextY = (y - center.Y > 0) ? center.Y - speed :
                        center.Y + speed;
            }
        }

        this.circle.animate({cx: nextX, cy: nextY}, 1000);
        this.SetXY(nextX, nextY);
    };

    Ball.prototype.isNearBall = function (x, y) {
        return (Math.abs(this.X() - x) < this.areaRadius &&
                Math.abs(this.Y() - y) < this.areaRadius);
    };
                    // ищем уравнение прямой, перпендикулярной стенке, о которую ударились
                    // находим точку, симметричную центру относительно данной прямой
    Ball.prototype.findReflectionPoint = function (hitX, hitY, tangens) {
        var center = {X : this.X(), Y: this.Y()},
            revertTangens = (tangens === 0) ? 0 : 1 / tangens;

        var x = (tangens === 0) ? hitX : (tangens / (tangens * tangens + 1)) * (hitY - center.Y + tangens * center.X + hitX * revertTangens);
        var y = (tangens === 0) ? center.Y :  tangens * x + (center.Y - tangens * center.X);

        var resultX = 2 * x - center.X,
            resultY = 2 * y - center.Y;

        var pushX = 2 * hitX - resultX,
            pushY = 2 * hitY - resultY;

        return {x : pushX, y: pushY};
    }
}(window));