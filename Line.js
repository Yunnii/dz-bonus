/*global Point: true*/
(function (exports) {
    "use strict";

    /**
     * A {Number}
     * B {Number}
     * C {Number}
     * Ax + By + C = 0
     */
    var Line = function () {
    };

    exports.Line = Line;

    /**
     * Построить прямую по двум точкам
     * @param start - первая
     * @param finish - вторая
     * @return {Line}
     */
    Line.GetLineFrom2Point = function (start, finish) {
        var temp = new Line();
        temp.A = start.Y - finish.Y;
        temp.B = finish.X - start.X;
        temp.C = start.X * finish.Y - finish.X * start.Y;

        return temp;
    };

    /**
     * Построить прямую по коэффициентам
     * @param a - при x
     * @param b - при y
     * @param c - свободный член
     * @return {Line}
     */
    Line.GetLineFromCoefficient = function (a, b, c) {
        var temp = new Line();
        temp.A = a;
        temp.B = b;
        temp.C = c;

        return temp;
    };

    /**
     * Построить прямую по направляющему вектору и точке, принадлежащей прямой
     * @param v - вектор
     * @param point - точка
     * @return {Line} - построенная прямая
     */
    Line.GetLineFromVectorAndPoint = function (v, point) {
        var temp = new Line();
        temp.A = v.X();
        temp.B = -v.Y();
        temp.C = v.X() * point.Y - v.Y() * point.X;

        return temp;
    };

    /**
     * Получить направляющий вектор прямой
     * @return {Vector} - направляющий вектор для данной прямой
     */
    Line.prototype.GetCollinearV = function () {
        return new Vector(-this.B, this.A);
    };

    /**
     * Построить прямую, перпендикулярную к данной, проходящую через заданную точку
     * @param point
     * @return {Line}
     */
    Line.prototype.GetNormalLine = function (point) {

        var a = -this.B,
            b = this.A,
            c = -a * point.X - b * point.Y;

        return Line.GetLineFromCoefficient(a, b, c);
    };

    /**
     * Найти точку пересечения двух прямых
     * @param otherLine
     * @return {Point}
     */
    Line.prototype.GetIntersectPoint = function (otherLine) {

        var x,
            y,
            assertParallel = this.A * otherLine.B - this.B * otherLine.A;

        if (Math.abs(assertParallel) < 0.001) {
            return null;
        }
        x = -(this.C * otherLine.B - otherLine.C * this.B) / assertParallel;
        y = -(this.A * otherLine.C - otherLine.A * this.C) / assertParallel;

        return new Point(x, y);
    };
}(window));