/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/12/13
 * Time: 6:26 PM
 * To change this template use File | Settings | File Templates.
 */
/*global Point: true*/
/*global Line: true*/
/*global tmpl: true*/

(function (exports) {
    "use strict";

    var template = "M <%= previous.X %>,<%= previous.Y %> L <%= next.X %>, <%= next.Y %>",
        arr = "M 154,477 L 237,381 L 237,381";

    /**
     * Создает экземпляр объекта, отвечающего за отрисовку объектов
     *
     * @param paper
     * @constructor
     * @this {Graphic}
     */
    var Graphic = function (paper) {
        this.canvas = paper;
    };

    exports.Graphic = Graphic;
    Graphic.borderWidth = 9;

    Graphic.prototype.paintArrow = function () {
        return this.canvas.path(arr)
                   .attr({stroke: "rgb(206, 102, 95)", "stroke-width": 20, "arrow-end": "classic", "stroke-opacity": 1});
    };

    Graphic.prototype.paintBorder = function (pathArray, pth) {
        this.canvas.path(pth)
              .attr({fill: "#eee", "fill-opacity": 1, stroke: "#333", "stroke-width": 0, "stroke-linecap": "square"});

        var that = this;
        pathArray.forEach(function (path) {
            that.canvas.path(path)
                  .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#fff", "stroke-width": 22, "stroke-linecap": "square"});
            that.canvas.path(path)
                  .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#333", "stroke-width": Graphic.borderWidth * 2, "stroke-linecap": "square"});
        });
    };

    Graphic.prototype.createBorder = function (result) {
        var i,
            current,
            borderArray = [],
            pathArray = [],
            previous = new Point(result[0].x, result[0].y),
            pth = "M".concat(previous.X, ",", previous.Y);

        for (i = 1; i < result.length; i += 1) {
            current = new Point(result[i].x, result[i].y);

            pathArray.push(tmpl(template, { previous: previous, next: current}));
            borderArray.push(Line.getLineFrom2Point(previous,  current));
            pth = pth.concat("L", current.X, ",", current.Y);

            previous = current;
        }

        current = new Point(result[0].x, result[0].y);
        pathArray.push(tmpl(template, { previous: previous, next : current}));
        borderArray.push(Line.getLineFrom2Point(previous,  current));
        pth = pth.concat("L", current.X, ",", current.Y);

        this.paintBorder(pathArray, pth);

        return borderArray;
    };

}(window));