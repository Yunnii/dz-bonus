/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 12/1/12
 * Time: 3:35 AM
 * To change this template use File | Settings | File Templates.
 */
/*global R: true*/
/*global Point: true*/
/*global Vector: true*/

(function (exports) {
    "use strict";

    var colour = "90-rgb(151, 193, 246)-rgb(89, 154, 219)",
        speed = 10;

    /**
     * Конструктор, принимает координаты центра шара, радиус и объект на котором необходимо его разместить
     *
     * @param {object} paper
     * @param {double}x
     * @param {double}y
     * @param {double}r
     *
     */
    var Ball = function (paper, x, y, r) {
        this.r = r;

        this.circle = paper.circle(x, y, r).attr({fill: colour});
        this.areaRadius = r + 30;
        this.Speed = new Vector(0, 0);
    };

    exports.Ball = Ball;

    Ball.prototype.X = function () { return this.circle.attrs.cx; };
    Ball.prototype.Y = function () { return this.circle.attrs.cy; };
    Ball.prototype.circleString = function () { return getCircleToPath(this.X(), this.Y(), this.r); };
    Ball.prototype.moveSpeed = function () { return speed; };
    /**
    * Пересчитать скорость для движения в указанном направлении
    *
    * @param {double}x - координата x, откуда по отношению к центру был толчок
    * @param {double}y - координата y, откуда по отношению к центру был толчок
    */

    Ball.prototype.moveBall = function (x, y) {

        var center = new Point(this.X(), this.Y()),
            hypot = Math.sqrt((center.Y - y) * (center.Y - y) + (center.X - x) * (center.X - x)),
            sinus = (center.Y - y) / hypot,
            cosinus = (center.X - x) / hypot;

        this.Speed.set(cosinus * speed, sinus * speed);
    };

    /**
    *  Двигаться в указанном ранее направлении
    *
    */
    Ball.prototype.move = function (updateTime) {

        var center = new Point(this.X(), this.Y()),
            nextX = center.X + this.Speed.X(),
            nextY = center.Y + this.Speed.Y();

        this.circle.stop().animate({cx: nextX, cy: nextY}, updateTime);
    };

    /** Принадлежит ли точка, переданная в параметре, окрестности радиуса this.areaRadius шара
    *
    * @param {double}x - координата x
    * @param {double}y - координата y
    */
    Ball.prototype.isNearBall = function (x, y) {
        return (Math.abs(this.X() - x) < this.areaRadius &&
                Math.abs(this.Y() - y) < this.areaRadius);
    };

    /**
     * Вызывает мерцание объекта
    */
    Ball.prototype.merkle = function () {
        this.circle.stop().attr({fill: colour, r: this.r + 5})
            .animate({fill: colour, r: this.r}, 150);
    };

    /**
    * Пересчет скорости при возникновении события "отражение от стенки"
    *
    * @param {Line}borderLine - уравнение прямой, описывающей стенку
    */

    Ball.prototype.reflectDirection = function (borderLine) {

        var center = new Point(this.X(), this.Y()),
            normalToBorderLine = borderLine.GetNormalLine(center),
            previousLocation = new Point(center.X - 2 * this.Speed.X(), center.Y - 2 * this.Speed.Y()),
            parallelToBorderLine = normalToBorderLine.GetNormalLine(previousLocation),
            reflectionPoint = parallelToBorderLine.GetIntersectPoint(normalToBorderLine),
            nextPoint = new Point(2 * reflectionPoint.X - previousLocation.X, 2 * reflectionPoint.Y - previousLocation.Y),
            normalizeNext = Vector.GetVectorFrom2Point(center, nextPoint).Normalize();

        this.Speed.set(speed * normalizeNext.X(), speed * normalizeNext.Y());
    };

    /**
     * Изменить направление скорости на противоположное
     */

    Ball.prototype.reflect = function () {
        this.Speed.set(-this.Speed.X(), -this.Speed.Y());
    };
}(window));