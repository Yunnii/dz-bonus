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
        this.circle = paper.circle(x, y, r).attr({fill: "#66e", "stroke-width": 2});
        this.areaRadius = r + 30;
    };

    exports.Ball = Ball;

    Ball.prototype.SetXY = function(x, y) {
            this.circle.attrs.cx = x;
            this.circle.attrs.cy = y;
        }

    Ball.prototype.X = function() { return this.circle.attrs.cx;}
    Ball.prototype.Y = function() { return this.circle.attrs.cy;}

    Ball.prototype.moveBall = function (x, y) {

        var center = {X : this.X(), Y: this.Y()};
        
        var tangens = (x - center.X === 0) ? 0 : (y - center.Y) / (x - center.X),
            nextX,
            nextY;

        if(x - center.X === 0) {
            nextX = center.X;
            nextY = (y - center.Y > 0 ) ? center.Y - 20 :
                    center.Y + 20;
            console.log("d");
        }
        else{
            nextX = (x - center.X > 0) ? center.X - 20 :
                    center.X + 20;
            nextY = tangens * nextX + (center.Y - tangens * center.X);
            if (Math.abs(tangens) > 1.1){
                nextY = (y - center.Y > 0 ) ? center.Y - 20 :
                    center.Y + 20;
            }
        }

        this.circle.animate({cx: nextX, cy: nextY}, 1000);
        this.SetXY(nextX, nextY);
    };

    Ball.prototype.isNearBall = function (x, y) {
        return (Math.abs(this.X() - x) < this.areaRadius &&
                Math.abs(this.Y() - y) < this.areaRadius);
    };
}(window));