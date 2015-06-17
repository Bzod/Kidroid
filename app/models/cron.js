/**
 * Created by anton_gorshenin on 02.06.2015.
 */
var mongoose = require('mongoose');

var CronSchema = mongoose.Schema({
        timeStart: Date,
        devices: Array,
        versionToUpdate: {
                version: String,
                build: String
        },
        status: String,
        name: String,
        type: String
});

module.exports = mongoose.model('Cron', CronSchema, "cron");