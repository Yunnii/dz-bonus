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
(function (exports) {
    "use strict";

   // exports.R = R;

    function load(border) {

        var R = Raphael("holder", 700, 540),
            colour = "r(0.5,0.5)hsb(4.8, 1, 1)-hsb(4.8, 1, .3)",
            dashed = {fill: "none", stroke: "#666", "stroke-dasharray": "- "},
            mouse = null,
            rot = 0;

        R.path(border).attr({fill: "#ddd", "fill-opacity": 1, stroke: "#333", "stroke-width": 24});
        var el = new Ball(R, 260, 350, 30);

        $("#holder").mousemove(function (e) {
            e = e || window.event;
            if (mouse === null) {
                mouse = e.pageX;
                return;
            }
            rot += e.clientX - mouse;
            mouse = e.pageX;

        });
    }

    function initialise() {

        $.getJSON('data.json')
                .error(function () { alert("Попробуйте позже, сервер недоступен =)"); })
                .success(function (result) {
                if (result.length === 0) {
                    return;
                }
                var border = "M " + result[0].x + "," + result[0].y,
                    i;

                for (i = 1; i < result.length; i += 1) {
                    border += "L " + result[i].x + "," + result[i].y;
                }
                border += "L " + result[0].x + "," + result[0].y;

                load(border);
            });
    }

    $(document).ready(initialise);

}(window));