/**
 * Created with JetBrains WebStorm.
 * User: yunnii
 * Date: 12/1/12
 * Time: 3:16 AM
 * To change this template use File | Settings | File Templates.
 */
(function (exports) {
    "use strict";

    var mouse = null,
        rot = 0;

    exports.model = function (e) {
        e = e || window.event;
        if (mouse === null) {
            mouse = e.pageX;
            return;
        }
        rot += e.clientX - mouse;
        el.attr({transform: "r" + rot});
        mouse = e.pageX;

    };
}(window));