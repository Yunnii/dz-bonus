/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/10/13
 * Time: 6:41 PM
 * To change this template use File | Settings | File Templates.
 */
(function (exports) {
    "use strict";

    /**
     * @param x
     * @param y
     */
    var Point = function (x, y) {
        this.X = x;
        this.Y = y;
    };

    exports.Point = Point;

    Point.Zero = new Point(0, 0);

    /**
     * Находит расстояние между точками
     *
     * @param otherPoint - точка, до которой необходимо найти расстояние
     * @return {Number} - расстояние между точками
     */
    Point.prototype.GetDistanceBetween = function (otherPoint) {

        return Math.sqrt((otherPoint.X - this.X) * (otherPoint.X - this.X)  + (otherPoint.Y - this.Y) * (otherPoint.Y - this.Y));
    };

}(window));