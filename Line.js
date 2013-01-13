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
        this.borderWidth = Graphic.borderWidth; // 12
    };

    exports.Line = Line;

    /**
     * Ограничить линию, установить концы отрезка.
     * @param start
     * @param finish
     */
    Line.prototype.SetTails = function (start, finish) {
        this.start = start;
        this.finish = finish;
    }

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
        temp.start = start;
        temp.finish = finish;

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
        temp.A = v.Y();
        temp.B = -v.X();
        temp.C = -v.Y() * point.X + v.X() * point.Y;

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

    /**
     * Найти точку пересечения данного отрезка и прямой. В случае отсутсвия пересечения возвращает null
     * @param otherLine
     * @return {Point}
     */
    Line.prototype.GetIntersectSegmentPoint = function (otherLine) {

        var crossPoint = this.GetIntersectPoint(otherLine);
        if (this.isBelongsToSegment(crossPoint)) {
            return crossPoint;
        }

        return null;
    };

    /**
     * Найти точку пересечения данного отрезка и прямой. В случае отсутсвия пересечения возвращает null
     * Считается что данная линия является границей с некой шириной, а другая линия - направление движения объекта с радиусом
     * @param otherLine
     * @return {Point}
     */
    Line.prototype.GetIntersectSegmentPointWithLimits = function (otherLine, center, radius) {

        var crossPoint = this.GetIntersectPoint(otherLine);
        if (this.isBelongsToSegment(crossPoint)) {
            return crossPoint;
        }

        if (crossPoint.GetDistanceBetween(this.start) < radius + this.borderWidth + 1 ||
            crossPoint.GetDistanceBetween(this.finish) < radius + this.borderWidth + 1) {
            return crossPoint;
        }

        return null;
    };

    /**
     * Определить принадлежит ли точка данному отрезку
     * @param point
     * @return {Boolean}
     */
    Line.prototype.isBelongsToSegment = function (point) {

        if (typeof this.finish === undefined || typeof this.start === undefined) {
            return true;
        }

        var p;

        if (this.finish.X !== this.start.X) {
            p = (point.X - this.finish.X) / (this.start.X - this.finish.X);
            if (p > 1 || p < 0) {
                return false;
            }
            return (Math.abs(p * this.start.Y + (1 - p) * this.finish.Y - point.Y) < 0.1);
        }
        if (this.finish.Y !== this.start.Y) {
            p = (point.Y - this.finish.Y) / (this.start.Y - this.finish.Y);
            if (p > 1 || p < 0) {
                return false;
            }
            return (Math.abs(p * this.start.X + (1 - p) * this.finish.X - point.X) < 0.1);
        }
        return false;
    };

    /**
     * Найти расстояние от точки до прямой
     * @param point
     * @return {Number}
     */
    Line.prototype.distanceBetween = function (point) {

        return Math.abs((this.A * point.X + this.B * point.Y + this.C) / Math.sqrt(this.A * this.A + this.B * this.B));
    };
}(window));