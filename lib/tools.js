/*
* @Author: lushijie
* @Date:   2017-12-15 19:04:20
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-15 19:40:09
*/
const crypto = require('crypto');
const uuid = require('uuid');
const Is = require('./is.js');

module.exports = {
  trimed(data) {
    if (Is.isString(data)) {
      return data.trim();
    } else if (Is.isObject(data)) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = module.exports.getTrimedObject(data[key]);
        }
      }
      return data;
    } else if (Is.isArray(data)) {
      return data.map(function(ele) {
        return module.exports.getTrimedObject(ele);
      });
    } else {
      return data;
    }
  },

  extend(target = {}, ...args) {
    let i = 0, length = args.length, options, name, src, copy;
    if (!target) {
      target = Is.isArray(args[0]) ? [] : {};
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
        if (Is.isArray(copy)) {
          target[name] = module.exports.extend([], copy);
        } else if (Is.isObject(copy)) {
          target[name] = module.exports.extend(src && Is.isObject(src) ? src : {}, copy);
        } else {
          target[name] = copy;
        }
      }
    }
    return target;
  },

  extends(...arg) {
    return module.exports.extend(...arg);
  },

  queryURL(url, key) {
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
  },

  encodeURIJSON(json) {
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
  },

  timeTaken(callback) {
    console.time('timeTaken');
    const r = callback();
    console.timeEnd('timeTaken');
    return r;
  },

  randomNumber(min, max, isInt) {
    if (isInt) return Math.floor(Math.random() * (max - min + 1)) + min;
    if (!isInt) return Math.random() * (max - min) + min;
  },

  objectToPairs(obj) {
    return Object.keys(obj).map(k => [k, obj[k]]);
  },

  roundToDigits(n, decimals = 0) {
    return Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);
  },

  truncate(str, num) {
    return str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
  },

  truncateNum(num, precision, fixedNum) {
    if (!Is.isNumber(num)) {
      throw new Error(`${num} is not a number`);
    }
    const unit =  Math.pow(10, precision);
    const newNum =  Math[num > 0 ? 'floor' : 'ceil'](num * unit) / unit;
    if (fixedNum) {
      return newNum.toFixed(fixedNum);
    }
    return newNum;
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  seriesPromise(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
  },

  promisify(func) {
    return (...args) =>
      new Promise((resolve, reject) =>
        func(...args, (err, result) =>
          err ? reject(err) : resolve(result))
      );
  },

  initializeArray(n, value = 0){
    return Array(n).fill(value);
  },

  md5(str) {
    return crypto.createHash('md5').update(str + '', 'utf8').digest('hex');
  },

  uuid(version) {
    if (version === 'v1') return uuid.v1();
    return uuid.v4();
  }
}
