"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../constants/Constants");
exports.updateTimer = function (msg) { return ({
    type: Constants_1.ActionTypes.UPDATE_TIMER,
    timeLeft: msg.total_stage_time - msg.stage_time_so_far,
    stage: msg.stage_name,
    totalTime: msg.total_stage_time,
}); };
exports.updateHeart = function () { return ({
    type: Constants_1.ActionTypes.UPDATE_HEART,
}); };
exports.updateMaster = function (msg) { return ({
    type: Constants_1.ActionTypes.UPDATE_MASTER,
    blueMaster: msg.blue,
    goldMaster: msg.gold,
}); };
exports.updateMatch = function (msg) { return ({
    type: Constants_1.ActionTypes.UPDATE_MATCH,
    matchNumber: msg.match_number,
    teamNames: msg.team_names,
    teamNumbers: msg.team_numbers,
}); };
exports.updateRobot = function (msg) { return ({
    type: Constants_1.ActionTypes.UPDATE_ROBOT,
    autonomous: msg.autonomous,
    enabled: msg.enabled,
}); };
exports.toggleFieldControl = function (msg) { return ({
    type: Constants_1.ActionTypes.FIELD_CONTROL,
    fieldControl: msg,
}); };
exports.updateFieldControl = function (msg) { return ({
    type: Constants_1.ActionTypes.UPDATE_FC_CONFIG,
    stationNumber: msg.stationNumber,
    bridgeAddress: msg.bridgeAddress,
}); };
