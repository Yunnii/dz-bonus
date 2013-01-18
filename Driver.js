/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/13/13
 * Time: 3:09 AM
 * To change this template use File | Settings | File Templates.
 */
/*global Point: true*/
/*global Line: true*/
/*global Vector: true*/
/*global Graphic: true*/

(function (exports) {
    "use strict";
    var colour = "90-rgb(151, 193, 246)-rgb(89, 154, 219)";
    /**
     *
     * Водитель. Управляет перемещением некоего объекта с радиусом в рамках многоугольной границы
     *
     * @param element - ведомый объект, чьей логикой движения при столкновении будем управлять
     * @param {Array of Line object} borderArray - массив границ
     * @constructor
     * @this {Driver}
     */
    var Driver = function (element, borderArray) {
        this.follower = element;
        this.border = borderArray;
        this.borderWidth = Graphic.borderWidth;
    };

    exports.Driver = Driver;

    /**
     * Находит расстояние до реальной точки пересечения (follower имеет радиус)
     *
     * @param lineNumber - номер линии в массиве borderArray,  с которой произошло столкновение
     * @param crossPoint - точка "мнимого" пересечения (пересечение  материальной точки с линией)
     * @param center - центр follower-a
     * @return {Object} информация о будущем пересечении
     */
    Driver.prototype.getDistanceToRealCross = function (lineNumber, crossPoint, center) {
        var distance,
            distanceToLine,
            cathetus,
            distanceToRealCross;

        distance = crossPoint.getDistanceBetween(center);
        distanceToLine = this.border[lineNumber].distanceBetween(center);
        cathetus = (this.follower.r + this.borderWidth) *  distance / distanceToLine;
        distanceToRealCross = distance - cathetus;

        return {
            distance: distanceToRealCross,
            line: this.border[lineNumber],
            cathetus: cathetus
        };
    };

    Driver.prototype.getImaginaryCross = function (anglePoint, speedLine, center) {
        var distance,
            distanceToLine,
            cathetus,
            distanceToRealCross;

        distanceToLine = speedLine.distanceBetween(anglePoint);
        cathetus = Math.sqrt((this.follower.r + this.borderWidth) * (this.follower.r + this.borderWidth) - distanceToLine * distanceToLine);
        distance = speedLine.getNormalLine(anglePoint).getIntersectPoint(speedLine).getDistanceBetween(center);
        distanceToRealCross = distance - cathetus;

        return {
            distance: distanceToRealCross
        };
    };

    /**
     * Находит пересечение границ с follower-ом
     *
     * @return {Object} информация о будущем пересечении
     */
    Driver.prototype.findIntersection = function () {
        var i,
            center = new Point(this.follower.X(), this.follower.Y()),
            line = Line.getLineFromVectorAndPoint(this.follower.Speed, center),
            crossPoint = null,
            crossBorder = [],
            minimalCrossPoint = null,
            result,
            temp;

        for (i = 0; i < this.border.length; i += 1) {
            crossPoint = this.border[i].getIntersectSegmentPointWithLimits(line, center, this.follower.r);
            if (crossPoint === null)  continue;

            if ((minimalCrossPoint === null) || (minimalCrossPoint && crossPoint.p.getDistanceBetween(center) < minimalCrossPoint.p.getDistanceBetween(center))) {
                if (this.follower.Speed.isAlignment(new Vector(crossPoint.p.X - center.X, crossPoint.p.Y - center.Y))) {
                    minimalCrossPoint = crossPoint;
                    crossBorder = [];
                    crossBorder.push(i);
                }
            } else if (Math.abs(crossPoint.p.getDistanceBetween(center) - minimalCrossPoint.p.getDistanceBetween(center)) < 0.2) {
                if (this.follower.Speed.isAlignment(new Vector(crossPoint.p.X - center.X, crossPoint.p.Y - center.Y))) {
                    crossBorder.push(i);
                }
            }
        }

        if (crossBorder.length === 1) {
            if (minimalCrossPoint.imaginaryStart) {
                temp =  this.getImaginaryCross(this.border[crossBorder[0]].start, line, center);
                temp.line = this.border[crossBorder[0]];
                return temp;
            }
            if (minimalCrossPoint.imaginaryFinish) {
                temp = this.getImaginaryCross(this.border[crossBorder[0]].finish, line, center);
                temp.line = this.border[crossBorder[0]];
                return temp;
            }
            return this.getDistanceToRealCross(crossBorder[0], minimalCrossPoint.p, center);
        }
        if (crossBorder.length > 1) {
            result = [];
            for (i = 0; i < 2; i += 1) {
                result.push(this.getDistanceToRealCross(crossBorder[i], minimalCrossPoint.p, center));
            }

            if (Math.abs(result[0].distance - result[1].distance) < 1) {
                result[0].changeOnOpposite = true;
                return result[0];
            }
        }
        return {
            distance: 0,
            line: 0,
            changeOnOpposite: true
        };
    };

}(window));