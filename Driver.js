/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/13/13
 * Time: 3:09 AM
 * To change this template use File | Settings | File Templates.
 */
/*global Point: true*/
/*global Line: true*/

(function (exports) {
    "use strict";

    var Driver = function (element, borderArray) {
        this.follower = element;
        this.border = borderArray;
        this.borderWidth = Graphic.borderWidth;
    };

    exports.Driver = Driver;

    Driver.prototype.getDistanceToRealCross = function (lineNumber, crossPoint, center) {
        var distance,
            distanceToLine,
            cathetus,
            distanceToRealCross;

        distance = crossPoint.GetDistanceBetween(center);
        distanceToLine = this.border[lineNumber].distanceBetween(center);
        cathetus = (this.follower.r + this.border[lineNumber].borderWidth) *  distance / distanceToLine;
        distanceToRealCross = distance - cathetus;

        return {
            distance: distanceToRealCross,
            kickCount: distanceToRealCross / this.follower.moveSpeed(),
            rest: distanceToRealCross % this.follower.moveSpeed(),
            line: this.border[lineNumber]
        };
    };

    Driver.prototype.findIntersection = function () {
        var i,
            center = new Point(this.follower.X(), this.follower.Y()),
            line = Line.GetLineFromVectorAndPoint(this.follower.Speed, center),
            crossPoint = null,
            crossBorder = [],
            minimalCrossPoint = null,
            centerInCross,
            normal,
            length,
            result;

        for (i = 0; i < this.border.length; i += 1) {
            crossPoint = this.border[i].GetIntersectSegmentPointWithLimits(line, center, this.follower.r);
            if (crossPoint === null)  continue;

            if ((minimalCrossPoint === null) || (minimalCrossPoint && crossPoint.GetDistanceBetween(center) < minimalCrossPoint.GetDistanceBetween(center))) {
                if (this.follower.Speed.isAlignment(new Vector(crossPoint.X - center.X, crossPoint.Y - center.Y))) {
                    minimalCrossPoint = crossPoint;
                    crossBorder = [];
                    crossBorder.push(i);
                }
            } else if (Math.abs(crossPoint.GetDistanceBetween(center) - minimalCrossPoint.GetDistanceBetween(center)) < 0.1) {
                if (this.follower.Speed.isAlignment(new Vector(crossPoint.X - center.X, crossPoint.Y - center.Y))) {
                    crossBorder.push(i);
                }
            }
        }

        if (crossBorder.length === 1) {
            return this.getDistanceToRealCross(crossBorder[0], minimalCrossPoint, center);
        }
        if (crossBorder.length > 1) {
            centerInCross = new Point(crossPoint.X - this.follower.r, crossPoint.Y - this.follower.r);
            normal = this.border[crossBorder[0]].GetNormalLine(centerInCross);
            length = normal.GetIntersectPoint(this.border[crossBorder[0]]).GetDistanceBetween(centerInCross);

            result = [];
            for (i = 0; i < crossBorder.length - 1; i += 1) {
                result.push(this.getDistanceToRealCross(crossBorder[i], minimalCrossPoint));
            }

            if (length < this.follower.r + crossBorder[0].borderWidth) {
                return (result[0].changeOnOposite = true);
            }

            if (Math.abs(result[0].distance - result[1].distance) < 1) {
                return (result[0].changeOnOposite = true);
            }

            return (Math.abs(result[0].distance) < Math.abs(result[1].distance)) ? result[0] : result[1];
        }
        return {
            distance: 0,
            kickCount: 0,
            rest: 0,
            line: 0,
            changeOnOposite: true
        };
    };

}(window));