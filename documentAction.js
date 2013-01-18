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
/*global Point: true*/
/*global Line: true*/
/*global Driver: true*/
/*global Graphic: true*/
/*global TaskQueue: true*/

(function (exports) {
    "use strict";

    var el,
        idInterval = null,
        driver,
        intersection,
        defaultTime = 30,
        arrow,
        interval,
        taskQueue;

    function manageIntersect() {
        var rest;

        if (!taskQueue.isEmpty()) {
            taskQueue.getNext();
            el.move(defaultTime);
        } else {
            rest = taskQueue.getRest();
            el.Speed.stretch(rest);

            el.move(defaultTime);
            el.Speed.stretch(el.moveSpeed());

            if (intersection.changeOnOpposite === true) {
                el.reflect();
            } else {
                el.reflectDirection(intersection.line);
            }

            intersection = driver.findIntersection();
            taskQueue = new TaskQueue(intersection.distance, el.moveSpeed());
        }
    }

    function moveBall(e) {
        e = e || window.event;

        if (el.isNearBall(e.pageX, e.pageY)) {
            el.moveBall(e.pageX, e.pageY);
            intersection = driver.findIntersection();
            taskQueue = new TaskQueue(intersection.distance, el.moveSpeed());

            if (idInterval === null) {
                clearInterval(interval);
                arrow.remove();

                manageIntersect();

                idInterval = setTimeout(function inside() {
                    manageIntersect();

                    setTimeout(inside, defaultTime);
                }, defaultTime);
            }
        }
    }

    /**
     * Загружаем координаты замкнутого многоугольника,
     * отрисовываем стенки, создаем шарик
    */
    function loadData() {

        $.getJSON('data.json')
                .error(function () { alert("Попробуйте позже, сервер недоступен =)"); })
                .success(function (result) {
                if (result.length === 0) {
                    return;
                }

                var canvas = Raphael("main", 1000, 1000),
                    graphicManager = new Graphic(canvas),
                    borders = graphicManager.createBorder(result);

                arrow = graphicManager.paintArrow();

                interval = setInterval(function () {
                    arrow.stop().attr({"stroke-width": 24, "stroke-opacity": 0.4})
                                .animate({"stroke-width": 20, "stroke-opacity": 1}, 1000);
                }, 1000);

                el = new Ball(canvas, 260, 350, 30);
                driver = new Driver(el, borders);

                $("#main").mousemove(moveBall);
            });
    }

    $(document).ready(loadData);

}(window));