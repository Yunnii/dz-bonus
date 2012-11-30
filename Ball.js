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

    var elattrs = [{cx: 60, fill: "#66e"}, {cx: 260, fill: "#66e"}],
        now = 1;

    var Ball = function (paper, x, y, r) {
        this.circle = paper.circle(x, y, r).attr({fill: "#66e", "stroke-width": 2});
        this.circle.click(function () {
            this.stop().animate(elattrs[+(now = !now)], 1300);
        });
    };

    exports.Ball = Ball;

    Ball.prototype.moveBall = function (x, y) {

    };

    Ball.prototype.isNearBall = function (x, y) {

    };
}(window));