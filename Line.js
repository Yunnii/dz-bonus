/*global Point: true*/
(function (exports) {
    "use strict";

    var Line = function () {
    };

    exports.Line = Line;

    Line.GetLineFrom2Point = function (start, finish) {
        var temp = new Line();
        temp.A = start.Y - finish.Y;
        temp.B = finish.X - start.X;
        temp.C = start.X * finish.Y - finish.X * start.Y;

        return temp;
    };

    Line.GetLineFromCoefficient = function (a, b, c) {
        var temp = new Line();
        temp.A = a;
        temp.B = b;
        temp.C = c;

        return temp;
    };

    Line.prototype.GetNormalLine = function (point) {

        var a = -this.B,
            b = this.A,
            c = -a * point.X - b * point.Y;

        return Line.GetLineFromCoefficient(a, b, c);
    };

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