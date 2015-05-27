/**
 * Created by anton_gorshenin on 24.04.2015.
 */
var Device = require('../models/device');

module.exports = {
    // �������� �� �� ����� ����������� �������
    getQuantity: function (callback) {
        var query = Device.count();
        query.exec(function (err, Devices) {
            // Execute callback
            callback(null, Devices);
        });
    },
    //����� ��������� �������� ��������
    getDevice: function (callback,params) {
        //console.log(params);
        var query = {};
        if (params!=undefined) {

            query.device_id = (!params.id) ? {$exists: true} : {$gte:+params.id};
            query.registered = (!params.status) ? {$exists: true} : params.status;
            query.school = (!params.category) ? {$exists: true} : params.category;
            query.apk_version = (!params.version) ? {$exists: true} : params.version;
        }
        console.log(query);
        query = Device.find(query).limit(10).sort({device_id:1});
        query.exec(function (err, Devices) {
            // Execute callback
            callback(null, Devices);
        });

    },
    // �������� �� ������� ID � ����� �� ��������������� � ��
    regDevice: function (id, callback) {

        var device = Device;

        device.findOne({"device_id": id.id, "registered": false}, function (err, device) {
            if (err) throw err;
            callback(null, device);
        });

    },
    //����������� ��������
    authDevice: function (deviceInfo, callback) {
        var device = Device;
        device.findOne({
            "device_id": deviceInfo.id,
            "token": deviceInfo.token,
            "registered": true
        }, function (err, device) {
            if (err) return console.log(err);
            callback(null, device);
        });
    },
    // ������� ������ �� �� ����������
    findVersion: function (deviceInfo, callback) {
        var device = Device;
        console.log("deviceInfo", deviceInfo);
        device.findOne({"device_id": deviceInfo.id}, {
            "_id": 1,
            "apk_to_update": 1
        }, function (err, device) {
            if (err) return console.log(err);
            callback(null, device);
        });
    },
    //��������� ���� �� �������
    saveDevice: function (deviceInfo, callback) {
        var newDevice = new Device({
            school: deviceInfo.school,
            timestamp: deviceInfo.timestamp,
            device_id: deviceInfo.deviceID,
            registered: deviceInfo.registered,
            apk_to_update: deviceInfo.update,
            apk_version: 0

        });
        newDevice.save(function (err) {
            if (err) {
                throw err;
            }
            // Execute callback passed from route
            callback(null, newDevice);
        });
    },

    registrDevice: function (deviceInfo, callback) {
        Device.findOne({"device_id": deviceInfo.id, "registered": false}, function (err, device) {
            if (err) {
                throw err;
            }
            if (device != null) {
                var token = Math.random().toString(36).substr(13);
                var update = {
                    "timestamp": new Date(),
                    "token": token,
                    "registered": true
                };
                Device.update({"device_id": deviceInfo.id}, {$set: update}, {upsert: true}, function (err, updated) {
                    if (err) {
                        console.log("not updated", err);
                    }
                    if (updated != null) {
                        // Execute callback passed from route
                        callback(null, token)
                    }
                });
            }
        });
    },

    updateDevice: function (deviceInfo, callback) {
        //����� � ��, ID ����������� �� �������
        console.log(deviceInfo.device_id,"update Device");
        Device.findOne({"device_id": deviceInfo.device_id}, function (err, device) {
            if (err) {
                throw err;
            }
            if (device != null) {
                // ����� ����� ID, ������� ���� ��� ������ � ��.
                var update = {
                    "timestamp": new Date(),
                    "latitude": [deviceInfo.latitude],
                    "longitude": [deviceInfo.longitude],
                    "loader_version": deviceInfo.loader_version,
                    "apk_version": deviceInfo.apk_version
                };
                //����� � �� � ID �� �������
                Device.update({"device_id": deviceInfo.device_id}, {$set: update}, {upsert: true}, function (err, updated) {
                    if (err) {
                        console.log("not updated", err);
                    }
                    console.log("updated", updated);
                    // Execute callback passed from route
                });
            }
            console.log("find err", err);
            callback(err);
        });

    },
    //TODO ����������, ������ �������� ��������� ��� ������������� ��������� id
    createDeviceId: function (callback) {
        var find = Device.find();

        find.exec(function (err, id) {
            if (err) {
                throw err;
            }
            // Execute callback
            id = id.length += 1;
            callback(null, id);
        });
    }
};