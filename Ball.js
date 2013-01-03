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

        var center = {X : this.X(), Y: this.Y()},
            hypot = Math.sqrt((center.Y - y) * (center.Y - y) + (center.X - x) * (center.X - x));

        this.tangens = (x - center.X === 0)
            ? (y - center.Y) / (x - center.X + 1)
            : (y - center.Y) / (x - center.X);
        this.sinus = (center.Y - y) / hypot;
        this.cosinus = (center.X - x) / hypot;
    };

    /** Двигаться в указанном ранее направлении
    *
    */
    Ball.prototype.move = function () {

        var center = {X : this.X(), Y: this.Y()},
            nextX = center.X + speed * this.cosinus,
            nextY = center.Y + speed * this.sinus;

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

    Ball.prototype.reflectDirection = function (tangens2, hit) {
        var center = {X : this.X(), Y: this.Y()},
            y_a = center.Y - this.tangens * center.X,
            x_b = (tangens2 - this.tangens) * tangens2 * center.X / (tangens2 * tangens2 + 1),
            y_b = tangens2 * x_b + (center.Y - tangens2 * center.X),
            x_c = 2 * x_b,
            y_c = 2 * y_b - y_a,
            product = (-y_a + center.Y - tangens2 * center.X) * (-hit.Y + tangens2 * hit.X + center.Y - tangens2 * center.X);

        return (product > 0) ? this.moveBall(0, y_a) : this.moveBall(x_c, y_c);
    };
}(window));