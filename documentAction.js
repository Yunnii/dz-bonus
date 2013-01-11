/**
 * Created by .
 * User: yunnii
 * Date: 11/29/12
 * Time: 2:47 PM
 * To change this template use File | Settings | File Templates.
 */
/*global $: true*/
/*global alert: true*/
/*global Raphael: true*/
/*global model: true*/
/*global Ball: true*/
/*global tmpl: true*/
/*global Point: true*/
/*global Line: true*/

(function (exports) {
    "use strict";

    Array.prototype.pushArray = function (arr) {
        this.push.apply(this, arr);
    };

    Array.prototype.containsPoint = function (point) {
        var i;
        for (i = 0; i < this.length; i += 1) {
            if (Math.abs(this[i].x - point.x) < 0.1 && Math.abs(this[i].y - point.y) < 0.1) {
                return true;
            }
        }
        return false;
    };

    var template = "M <%= previous.X %>,<%= previous.Y %> L <%= next.X %>, <%= next.Y %> L <%= next.X %>,<%= next.Y %>",
        el,
        idInterval = null,
        pathArray = [],
        borderArray = [];


    function intersectChecker() {
        var i,
            hitNumber = [],
            intersect = [],
            hitCount = 0;

        for (i = 0; i < pathArray.length; i += 1) {
            intersect = Raphael.pathIntersection(pathArray[i], el.circleString());
            if (intersect.length > 0) {
                hitCount += 1;
                hitNumber.push(i);
            }
        }
        if (hitCount === 1) {
            el.reflectDirection(borderArray[hitNumber]);
        } else if (hitCount > 1) {
            el.reflect();
        }
    }

    function moveBall(e) {
        e = e || window.event;

        if (el.isNearBall(e.pageX, e.pageY)) {
            el.moveBall(e.pageX, e.pageY);

            if (idInterval === null) {
                intersectChecker();
                el.move();

                idInterval = setInterval(function () {
                    intersectChecker();
                    el.move();
                }, 200);
            }
        }
    }

    /**
     * инициализируем шар
     */
    function load() {
        var canvas = Raphael("main", 1000, 1000);

        pathArray.forEach(function (path) {
            canvas.path(path)
                        .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#fff", "stroke-width": 22});
            canvas.path(path)
                        .attr({fill: "#ddd", "fill-opacity": 1, stroke: "#333", "stroke-width": 16});
        });

        el = new Ball(canvas, 260, 350, 30);

        $("#main").mousemove(moveBall);
    }

    /**
     * Загружаем координаты стенки
    */
    function loadData() {

        $.getJSON('data.json')
                .error(function () { alert("Попробуйте позже, сервер недоступен =)"); })
                .success(function (result) {
                if (result.length === 0) {
                    return;
                }

                var i,
                    next,
                    previous = new Point(result[0].x, result[0].y);

                for (i = 1; i < result.length - 1; i += 1) {
                    next = new Point(result[i + 1].x, result[i + 1].y);
                    pathArray.push(tmpl(template, { previous: previous,
                                                    next: next}));
                    borderArray.push(Line.GetLineFrom2Point(previous,  next));
                    previous = next;
                }

                next = new Point(result[0].x, result[0].y);
                pathArray.push(tmpl(template, { previous: previous,
                                                next: next}));
                borderArray.push(Line.GetLineFrom2Point(previous,  next));
                load();
            });
    }

    $(document).ready(loadData);

}(window));