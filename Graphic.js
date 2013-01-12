/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 1/12/13
 * Time: 6:26 PM
 * To change this template use File | Settings | File Templates.
 */
(function (exports) {
    "use strict";

    var template = "M <%= previous.X %>,<%= previous.Y %> L <%= next.X %>, <%= next.Y %> L <%= next.X %>,<%= next.Y %>",
        arr = "M 154,477 L 237,381 L 237,381",
        canvas;

    var Graphic = function (paper) {
        canvas = paper;
    };

    exports.Graphic = Graphic;

    function paintBorder(pathArray, pth) {
        canvas.path(pth)
              .attr({fill: "#fff", "fill-opacity": 1, stroke: "#333", "stroke-width": 1, "stroke-linecap": "square"});

        pathArray.forEach(function (path) {
            canvas.path(path)
                  .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#fff", "stroke-width": 24, "stroke-linecap": "square"});
            canvas.path(path)
                  .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#333", "stroke-width": 18, "stroke-linecap": "square"});
        });
    };

    Graphic.prototype.paintArrow = function () {
        canvas.path(arr)
                   .attr({stroke: "rgb(206, 102, 95)", "stroke-width": 20, "arrow-end": "classic"});
    };

    Graphic.prototype.createBorder = function (result, pathArray, borderArray) {
        var i,
            next,
            previous = new Point(result[0].x, result[0].y),
            pth = "M".concat(previous.X, ",", previous.Y, "L", previous.X, ",", previous.Y);

        for (i = 1; i < result.length - 1; i += 1) {
            next = new Point(result[i + 1].x, result[i + 1].y);

            pathArray.push(tmpl(template, { previous: previous, next: next}));
            borderArray.push(Line.GetLineFrom2Point(previous,  next));
            pth.concat("L", next.X, ",", next.Y);

            previous = next;
        }

        next = new Point(result[0].x, result[0].y);
        pathArray.push(tmpl(template, { previous: previous, next : next}));
        borderArray.push(Line.GetLineFrom2Point(previous,  next));
        pth.concat("L", next.X, ",", next.Y);

        paintBorder(pathArray, pth);
    };

}(window));