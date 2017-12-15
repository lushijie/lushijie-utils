/*
* @Author: lushijie
* @Date:   2017-11-25 16:20:55
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-15 19:02:17
*/
function objectToString(o) {
  return Object.prototype.toString.call(o);
}

module.exports = {
  isNull(arg) {
    return arg === null;
  },

  isUndefined(arg) {
    return arg === undefined;
  },

  isBoolean(arg) {
    return typeof arg === 'boolean';
  },

  isNumber(arg) {
    return typeof arg === 'number';
  },

  isString(arg) {
    return typeof arg === 'string';
  },

  isSymbol(arg) {
    return typeof arg === 'symbol';
  },

  isFunction(arg) {
    return typeof arg === 'function';
  },

  isArray(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
  },

  isRegExp(re) {
    return objectToString(re) === '[object RegExp]';
  },

  isObject(arg) {
    return objectToString(arg) === '[object Object]';
  },

  isDate(d) {
    return objectToString(d) === '[object Date]';
  },

  isError(e) {
    return (objectToString(e) === '[object Error]' || e instanceof Error);
  },

  isNullOrUndefined(arg) {
    return arg == null;
  },

  isBuffer(arg) {
    return Buffer.isBuffer(arg);
  },

  isInt(value) {
    if (isNaN(value) || module.exports.isString(value)) {
      return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
  },

  isTrueEmpty(obj) {
    if (obj === undefined || obj === null || obj === '') return true;
    if (exports.isNumber(obj) && isNaN(obj)) return true;
    return false;
  }
}
