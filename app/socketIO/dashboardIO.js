/**
 * Created by anton_gorshenin on 22.05.2015.
 */

module.exports = function (server) {
    var user = require('../routes/users.js');
    var io = require('socket.io').listen(server);

    var deviceMagic = require('../dbMagic/deviceMagic');

    io.on('connection', function(socket){
        user.getDevice(function (err, Devices) {
            if (err) {
                console.log(err);
            }
            io.emit('firstData', Devices);
        },10);

        socket.on('disconnect', function(){
            console.log('user disconnected');}
        );

        socket.on('test', function(count){
                user.getDevice(function (err, Devices) {
                       if (err) {
                           console.log(err);
                       }
                   io.emit('firstData', Devices);
               },count);
            }
        )

    });
};