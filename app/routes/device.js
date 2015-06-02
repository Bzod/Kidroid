var deviceMagic = require('../dbMagic/deviceMagic');
var user = require('../routes/users.js');
var server = require('../../config/server.js').address;

module.exports = {
    // ��������� ����� ��������� ��� ���������� ������ ������
    checkStatus: function(){
        deviceMagic.getAllDevice(function(err,data){
            if (err) return console.log(err,"checkStatus deviceMagic.getAllDevice err");

            data.forEach(function(device){
                var time = (new Date - device.timestamp)/60000;
                if (time > 30){
                    deviceMagic.updateDeviceStatus(device._id);
                }
            })
        });
    },
//����������� �������
    getRegistrationDevice: function (req, res) {

        deviceMagic.regDevice({id: req.body.id}, function (err, next) {

            if (err) return console.log(err,"getRegistrationDevice deviceMagic.regDevice err");

            if (next === null) {
                res.json({"error": "wrong ID"});
            }

            deviceMagic.registrDevice(req.body, function (err, token) {

                if (err) return console.log(err,"getRegistrationDevice deviceMagic.registrDevice err");

                if (token != null) {
                    console.log("res token", token);
                    res.json({"token": token});
                }

            });
        });
    },
//����������� �������� �� �� � ������
    getAuthorizationDevice: function (req, res, next) {
        console.log(req.body, "Authorization Data");
        var id = !req.param.id ? req.body.device_id : req.params.id;
        var token = !req.param.token ? req.body.token : req.params.token;
        deviceMagic.authDevice({id: id, token: token}, function (err, callback) {

            if (err) return console.log(err,"getAuthorizationDevice deviceMagic.authDevice err");

            if (callback === null) {
                return res.json({"error": "Wrong ID"});
            }

            return next();

        });
    },
    // ������ ������������� ���������� ������ ���
    checkApkVersion: function (req, res, next) {
        deviceMagic.findVersion({id: req.body.device_id}, function (err, device) {

            if (err) return console.log(err,"checkApkVersion deviceMagic.findVersion err");

            if (device.update_required === false) {
                next();
            }
            else {
                user.findLink(device.apk_to_update,function(err,callback){

                    if (err) return console.log(err,"checkApkVersion user.findLink err");

                    res.json({update_required: true, version: device.apk_to_update, link: server + callback[0].link});
                })
            }

        });
    },
    getApk: function (req, res, next) {
        deviceMagic.findVersion({id: req.params.id}, function (err, device) {

            if (err) return console.log(err,"getApk deviceMagic.findVersion err");

            if (device.update_required === false) {
                next();
            }
            else {
                user.findLink(device.apk_to_update,function(err,callback){

                    if (err) return console.log(err,"getApk user.findLink err");

                    res.json({update_required: true, version: device.apk_to_update, link: server + callback[0].link});
                })
            }

        });
    },
    //���������� ������ ���������� �� ��������
    getSaveData: function (req, res) {
        deviceMagic.updateDevice(req.body, function (err) {

            if (err) return console.log(err,"getSaveData deviceMagic.updateDevice err");

            res.json({update_required: false, version: 0, link: null});
        });
    }
};
