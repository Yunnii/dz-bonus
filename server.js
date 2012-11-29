/**
 * Created by .
 * User: yunnii
 * Date: 11/29/12
 * Time: 6:02 PM
 * To change this template use File | Settings | File Templates.
 */
var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080);