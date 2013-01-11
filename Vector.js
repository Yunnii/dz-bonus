/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/10/13
 * Time: 8:17 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Point: true*/

(function (exports) {
    "use strict";

    var Vector = function (x, y) {
        this.V = new Point(x, y);
    };

    exports.Vector = Vector;

    Vector.GetVectorFrom2Point = function (start, finish) {

        return new Vector(finish.X - start.X, finish.Y - start.Y);
    };

    Vector.prototype.GetLength = function () {

        return Math.abs(this.V.GetDistanceBetween(Point.Zero));
    };

    Vector.prototype.Normalize = function () {

        var length = this.GetLength();
        return new Vector(this.V.X / length, this.V.Y / length);
    };

    Vector.prototype.isCollinear = function (otherVector) {
        return Math.abs(this.V.X * otherVector.V.Y - this.V.Y * otherVector.V.X) < 0.1 ? true : false;
    };

}(window));