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

    /**
     * Конструктор, принимает координаты центра шара, радиус и объект на котором необходимо его разместить
     *
     * @param {object} paper
     * @param {double}x
     * @param {double}y
     * @param {double}r
     *
     * @example
     *     item.set({title: "March 20", content: "In his eyes she eclipses..."});
     */
    var Ball = function (paper, x, y, r) {
        this.r = r;
        this.circle = paper.circle(x, y, r).attr({fill: "#66e", "stroke-width": 2});
        this.areaRadius = r + 30;
        this.Speed = new Vector(0, 0);
    };

    /** Отдает поле circle в виде строки типа Raphael.path
    *
    * @return {string} Cтроковое представление.
    */
    function getCircleToPath(x, y, r) {
        var s = "M";
        s = s + (x) + "," + (y - r) + "A" + r + "," + r + ",0,1,1," + (x - 0.1) + "," + (y - r) + "z";
        return s;
    }

    exports.Ball = Ball;

    /** Изменяет положение объекта
    *
    * @param {double}x - новая координата х центра
    * @param {double}y - новая координат у центра
    */
    Ball.prototype.SetXY = function (x, y) {
        this.circle.attrs.cx = x;
        this.circle.attrs.cy = y;
    };

    Ball.prototype.X = function () { return this.circle.attrs.cx; };
    Ball.prototype.Y = function () { return this.circle.attrs.cy; };
    Ball.prototype.circleString = function () { return getCircleToPath(this.X(), this.Y(), this.r); };

    var speed = 30;

    /** Перемещение в указанном направлении
    *
    * @param {double}x - координата x, откуда по отношению к центру был толчок
    * @param {double}y - координата y, откуда по отношению к центру был толчок
    */

    Ball.prototype.moveBall = function (x, y) {

        var center = new Point(this.X(), this.Y()),
            hypot = Math.sqrt((center.Y - y) * (center.Y - y) + (center.X - x) * (center.X - x)),
            sinus = (center.Y - y) / hypot,
            cosinus = (center.X - x) / hypot;

        this.Speed.V.X = cosinus * speed;
        this.Speed.V.Y = sinus * speed;
    };

    /** Двигаться в указанном ранее направлении
    *
    */
    Ball.prototype.move = function () {

        var center = new Point(this.X(), this.Y()),
            nextX = center.X + this.Speed.V.X,
            nextY = center.Y + this.Speed.V.Y;

        this.circle.stop().animate({cx: nextX, cy: nextY}, 1000);
        this.SetXY(nextX, nextY);
    };

    /** Принадлежит ли точка, переданная в параметре окрестности радиуса this.areaRadius шара
    *
    * @param {double}x - координата x
    * @param {double}y - координата y
    */
    Ball.prototype.isNearBall = function (x, y) {
        return (Math.abs(this.X() - x) < this.areaRadius &&
                Math.abs(this.Y() - y) < this.areaRadius);
    };

    /** Перемещение в указанном направлении
    * ищем уравнение прямой, перпендикулярной стенке, о которую ударились
    * находим точку, симметричную точке (x=0, y=f(x), такое что (x,y) принадлежит прямой, вдоль движения шара)
    * относительно данной прямой
    *
    * @param {double}tangens - тангенс угла наклона стенки
    */

    Ball.prototype.reflectDirection = function (borderLine) {

        var center = new Point(this.X(), this.Y()),
            normalToBorderLine = borderLine.GetNormalLine(center),
            previousLocation = new Point(center.X - this.Speed.V.X, center.Y - this.Speed.V.Y),
            parallelToBOrderLine = normalToBorderLine.GetNormalLine(previousLocation),
            reflectionPoint = parallelToBOrderLine.GetIntersectPoint(normalToBorderLine),
            nextPoint = new Point(2 * previousLocation.X - reflectionPoint.X, 2 * previousLocation.Y - reflectionPoint.Y),
            normalizeNext = Vector.GetVectorFrom2Point(center, nextPoint).Normalize(),
            speedLength  = this.Speed.GetLength();

        this.Speed.V.X = speedLength * normalizeNext.V.X;
        this.Speed.V.Y = speedLength * normalizeNext.V.Y;
    };
}(window));