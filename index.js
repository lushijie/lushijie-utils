const toString = Object.prototype.toString;
const crypto = require('crypto');
const uuid = require('uuid');
const net = require('net');
const {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isRegExp,
  // isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  isBuffer
} = require('core-util-is');

const isObject = function(obj) {
  return toString.call(obj) === '[object Object]';
}

exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isNull = isNull;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isSymbol = isSymbol;
exports.isUndefined = isUndefined;
exports.isRegExp = isRegExp;
exports.isObject = isObject;
exports.isDate = isDate;
exports.isError = isError;
exports.isFunction = isFunction;
exports.isPrimitive = isPrimitive;
exports.isBuffer = isBuffer;
exports.isIP = net.isIP;
exports.isIPv4 = net.isIPv4;
exports.isIPv6 = net.isIPv6;

exports.isInt = function(value) {
  if (isNaN(value) || isString(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

exports.isTrueEmpty = function(obj) {
  if (obj === undefined || obj === null || obj === '') return true;
  if (isNumber(obj) && isNaN(obj)) return true;
  return false;
}

exports.trimed = function(data) {
  if (isString(data)) {
    return data.trim();
  } else if (isObject(data)) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = exports.getTrimedObject(data[key]);
      }
    }
    return data;
  } else if (isArray(data)) {
    return data.map(function(ele) {
      return exports.getTrimedObject(ele);
    });
  } else {
    return data;
  }
}

exports.extend = function(target = {}, ...args) {
  let i = 0, length = args.length, options, name, src, copy;
  if (!target) {
    target = isArray(args[0]) ? [] : {};
  }
  for (; i < length; i++) {
    options = args[i];
    if (!options) {
      continue;
    }
    for (name in options) {
      src = target[name];
      copy = options[name];
      if (src && src === copy) {
        continue;
      }
      if (isArray(copy)) {
        target[name] = exports.extend([], copy);
      } else if (isObject(copy)) {
        target[name] = exports.extend(src && isObject(src) ? src : {}, copy);
      } else {
        target[name] = copy;
      }
    }
  }
  return target;
}

exports.extends = exports.extend;

exports.queryURL = function(url, key) {
  url = url.replace(/^[^?=]*\?/ig, '').split('#')[0];
  let json = {};
  url.replace(/(^|&)([^&=]+)=([^&]*)/g, function(a, b, key, value) {
    // untrusted data
    try {
      key = decodeURIComponent(key);
    } catch (e) {}
    try {
      value = decodeURIComponent(value);
    } catch (e) {}

    if (!(key in json)) {
      json[key] = /\[\]$/.test(key) ? [value] : value; // regard param'name end with [] as an array param
    } else if (json[key] instanceof Array) {
      json[key].push(value);
    } else {
      json[key] = [json[key], value];
    }
  });
  return key ? json[key] : json;
}

exports.encodeURIJSON = function(json) {
  let s = [];
  for (let p in json) {
    if (json[p] == null) {
      // undefined null will pass
      continue;
    }
    if (json[p] instanceof Array) {
      for (let i = 0; i < json[p].length; i++) {
        s.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p][i]));
      }
    } else {
      s.push((p) + '=' + encodeURIComponent(json[p]));
    }
  }
  return s.join('&');
}

exports.timeTaken = function(callback) {
  console.time('timeTaken');
  const r = callback();
  console.timeEnd('timeTaken');
  return r;
}

exports.randomNumber = function(min, max, isInt) {
  if (isInt) return Math.floor(Math.random() * (max - min + 1)) + min;
  if (!isInt) return Math.random() * (max - min) + min;
}

exports.objectToPairs = function(obj) {
  return Object.keys(obj).map(k => [k, obj[k]]);
}

exports.truncate = function(str, num) {
  return str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
}

exports.truncateNum = function(num, precision, fixedNum) {
  if (!isNumber(num)) {
    throw new Error(`${num} is not a number`);
  }
  if (fixedNum === undefined) {
    fixedNum = precision;
  }
  const unit =  Math.pow(10, precision);
  const newNum =  Math[num > 0 ? 'floor' : 'ceil'](num * unit) / unit;
  return newNum.toFixed(fixedNum);
}

exports.sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports.seriesPromise = function(ps) {
  return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

exports.promisify = function(func) {
  return (...args) =>
    new Promise((resolve, reject) =>
      func(...args, (err, result) =>
        err ? reject(err) : resolve(result))
    );
}

exports.initializeArray = function(n, value = 0){
  return Array(n).fill(value);
}

exports.md5 = function(str) {
  return crypto.createHash('md5').update(str + '', 'utf8').digest('hex');
},

exports.uuid = function(version) {
  if (version === 'v1') return uuid.v1();
  return uuid.v4();
}

exports.interop = function(require) {
  return require && require.__esModule ? require['default'] : require;
}

exports.dateTimeFormat = function(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
}

exports.renameKeys = function(object, changeMap, onlyGetMapItem) {
  if (!changeMap || typeof changeMap !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    const newArray = [];
    for (let i = 0; i < object.length; i++) {
      newArray.push(Utils.renameKeys(object[i], changeMap));
    }
    return newArray;
  } else {
    if (typeof object !== 'object') {
      return object;
    }
    const newCopy = {};
    const copy = Utils.extend({}, object);

    for (const key in changeMap) {
      if (typeof changeMap[key] === 'object') {
        if (copy.hasOwnProperty(key)) {
          copy[key] = Utils.renameKeys(copy[key], changeMap[key]);
          newCopy[key] = Utils.renameKeys(copy[key], changeMap[key]);
          continue;
        }
      }

      if (copy.hasOwnProperty(key) && key !== changeMap[key]) {
        const temp = copy[key];

        copy[changeMap[key]] = temp;
        newCopy[changeMap[key]] = temp;
        delete copy[key];
      }
    }
    return !onlyGetMapItem ? copy : newCopy;
  }
}

// getDestructResult(['houseId', 'item:item1'], this.state);
exports.getDestructResult = function (properties, sourceObject) {
  const destObject = {};

  const aliasMap = {};
  properties = Array.isArray(properties) ? properties : [properties];

  // 建立别名映衬
  properties = properties.map(function(ele) {
    if (ele.indexOf(':') > -1) {
      aliasMap[ele.split(':')[0]] = ele.split(':')[1];
    }
    return ele.split(':')[0];
  });

  // 如果存在别名，新对象使用别名
  Object.keys(sourceObject).forEach(function(ele) {
    if (properties.indexOf(ele) > -1) {
      destObject[aliasMap[ele] || ele] = sourceObject[ele];
    }
  });
  return destObject;
}