/*global Point: true*/
/*global Graphic: true*/
/*global Vector: true*/

(function (exports) {
    "use strict";

    /**
     * Хранит линию/сегмент как коэффициенты уравнения
     *
     * @private
     * @constructor
     * @this {Line}
     *
     * A {Number}
     * B {Number}
     * C {Number}
     * Ax + By + C = 0
     */
    var Line = function () {
        /** @private */
        this.borderWidth = Graphic.borderWidth; // 12
    };

    exports.Line = Line;

    /**
     * Ограничить линию, установив концы отрезка.
     *
     * @param {Point} start
     * @param {Point} finish
     */
    Line.prototype.setTails = function (start, finish) {
        this.start = start;
        this.finish = finish;
    };

    /**
     * Возвращает экземпляр прямой по двум точкам
     *
     * @param start - первая точка
     * @param finish - вторая точка
     * @return {Line}
     */
    Line.getLineFrom2Point = function (start, finish) {
        var temp = new Line();
        temp.A = start.Y - finish.Y;
        temp.B = finish.X - start.X;
        temp.C = start.X * finish.Y - finish.X * start.Y;
        temp.start = start;
        temp.finish = finish;

        return temp;
    };

    /**
     * Возвращает экземпляр прямой, построенный по коэффициентам
     *
     * @param {number} a - при x
     * @param {number} b - при y
     * @param {number} c - свободный член
     * @return {Line}
     */
    Line.getLineFromCoefficient = function (a, b, c) {
        var temp = new Line();
        temp.A = a;
        temp.B = b;
        temp.C = c;

        return temp;
    };

    /**
     * Возвращает экземпляр прямой, построенный по направляющему вектору
     * и точке, принадлежащей прямой
     *
     * @param {Vector} v
     * @param {Point} point
     * @return {Line}
     */
    Line.getLineFromVectorAndPoint = function (v, point) {
        var temp = new Line();
        temp.A = v.Y();
        temp.B = -v.X();
        temp.C = -v.Y() * point.X + v.X() * point.Y;

        return temp;
    };

    /**
     * Получить направляющий вектор прямой
     *
     * @return {Vector} - направляющий вектор для данной прямой
     */
    Line.prototype.getCollinearV = function () {
        return new Vector(-this.B, this.A);
    };

    /**
     * Построить прямую, перпендикулярную к данной, проходящую через заданную точку
     *
     * @param {Point} point
     * @return {Line}
     */
    Line.prototype.getNormalLine = function (point) {

        var a = -this.B,
            b = this.A,
            c = -a * point.X - b * point.Y;

        return Line.getLineFromCoefficient(a, b, c);
    };

    /**
     * Найти точку пересечения двух прямых
     *
     * @param {Line} otherLine
     * @return {Point}
     */
    Line.prototype.getIntersectPoint = function (otherLine) {

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

    /**
     * Найти точку пересечения данного отрезка и прямой.
     * В случае отсутсвия пересечения возвращает null
     *
     * @param {Line} otherLine
     * @return {Point}
     */
    Line.prototype.getIntersectSegmentPoint = function (otherLine) {

        var crossPoint = this.getIntersectPoint(otherLine);
        if (this.isBelongsToSegment(crossPoint)) {
            return crossPoint;
        }

        return null;
    };

    /**
     * Найти точку пересечения данного отрезка и прямой. В случае отсутсвия пересечения возвращает null
     * Считается что данная линия является границей с некой шириной, а другая линия - направление движения объекта с радиусом
     *
     * @param {Line} otherLine
     * @param {Point} center
     * @param {number} radius
     * @return {Object}
     */
    Line.prototype.getIntersectSegmentPointWithLimits = function (otherLine, center, radius) {

        var crossPoint = this.getIntersectPoint(otherLine);

        if (crossPoint === null) {
            if (this.distanceBetween(center) < radius + this.borderWidth) {
                crossPoint = this.getNormalLine(center).getIntersectSegmentPoint(this);
            } else {
                return null;
            }
        }

        if (this.isBelongsToSegment(crossPoint)) {
            return {
                p: crossPoint,
                imaginary: false
            };
        }

        if (crossPoint.getDistanceBetween(this.start) < radius + this.borderWidth) {
            return {
                p: crossPoint,
                imaginaryStart: true
            };
        }
        if (crossPoint.getDistanceBetween(this.finish) < radius + this.borderWidth) {
            return {
                p: crossPoint,
                imaginaryFinish: true
            };
        }

        return null;
    };

    /**
     * Определить принадлежит ли точка данному отрезку
     *
     * @param {Point} point
     * @return {Boolean}
     */
    Line.prototype.isBelongsToSegment = function (point) {
        if (typeof this.finish === undefined || typeof this.start === undefined) {
            return true;
        }

        var p;

        if (this.finish.X !== this.start.X) {
            p = (point.X - this.finish.X) / (this.start.X - this.finish.X);
            if (p > 1.00001 || p < 0.00001) {
                return false;
            }
            return (Math.abs(p * this.start.Y + (1 - p) * this.finish.Y - point.Y) < 0.1);
        }
        if (this.finish.Y !== this.start.Y) {
            p = (point.Y - this.finish.Y) / (this.start.Y - this.finish.Y);
            if (p > 1.00001 || p < 1.00001) {
                return false;
            }
            return (Math.abs(p * this.start.X + (1 - p) * this.finish.X - point.X) < 0.1);
        }
        return false;
    };

    /**
     * Найти расстояние от точки до прямой
     *
     * @param {Point} point
     * @return {Number}
     */
    Line.prototype.distanceBetween = function (point) {

        return Math.abs((this.A * point.X + this.B * point.Y + this.C) / Math.sqrt(this.A * this.A + this.B * this.B));
    };
}(window));