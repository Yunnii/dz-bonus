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

    /**
     * Создает экземпляр объекта, представляющего вектор
     *
     * @param {double}x
     * @param {double}y
     * @constructor
     * @this {Vector}
     */
    var Vector = function (x, y) {
        this.V = new Point(x, y);
    };

    exports.Vector = Vector;

    Vector.prototype.X = function () { return this.V.X; };
    Vector.prototype.Y = function () { return this.V.Y; };
    Vector.prototype.set = function (x, y) { this.V.X = x; this.V.Y = y; };

    /**
     * Создает вектор по двум точкам
     *
     * @param start - начало
     * @param finish - конец
     * @return {Vector} - созданный вектор
     */
    Vector.getVectorFrom2Point = function (start, finish) {

        return new Vector(finish.X - start.X, finish.Y - start.Y);
    };

    Vector.prototype.stretch = function (k) {
        var direction  = this.normalize();
        this.set(direction.X() * k, direction.Y() * k);
    };

    /**
     * Возвращает длину вектора
     *
     * @return {Number} - длина вектора
     */
    Vector.prototype.getLength = function () {

        return Math.abs(this.V.getDistanceBetween(Point.Zero));
    };

    /**
     * Возвращает нормализованный вектор
     *
     * @return {Vector} - вектор единичной длины, направление совпадает с данным
     */
    Vector.prototype.normalize = function () {

        var length = this.getLength();
        return new Vector(this.X() / length, this.Y() / length);
    };

    /**
     * Определяет коллинеарность данного вектора с вектором, переданным в параметре
     *
     * @param otherVector
     * @return {Boolean} true - коллинеарны, false - не коллинеарны
     */
    Vector.prototype.isCollinear = function (otherVector) {
        return (Math.abs(this.X() * otherVector.Y() - this.Y() * otherVector.X()) < 0.1) ? true : false;
    };

    function sign(value) {
        return (value > 0) ? 1 : -1;
    }

    /**
     * Определяет сонаправленность данного вектора с вектором, переданным в параметре
     *
     * @param otherVector
     * @return {Boolean} true - сонаправлены, false - не коллинеарны или не сонаправлены
     */
    Vector.prototype.isAlignment = function (otherVector) {
        if (!this.isCollinear(otherVector)) {
            return false;
        } else {
            return (sign(otherVector.X()) === sign(this.X())) && (sign(otherVector.Y()) === sign(this.Y()));
        }
    };
}(window));