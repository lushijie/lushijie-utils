/*
* @Author: lushijie
* @Date:   2017-11-25 16:20:55
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-15 19:38:06
*/
const Tools = require('./tools.js');
const Is = require('./is.js');
const Utils = Tools.extend({}, Tools, Is);
module.exports = Utils;

