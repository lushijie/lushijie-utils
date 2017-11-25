/*
* @Author: lushijie
* @Date:   2017-11-25 16:20:55
* @Last Modified by:   lushijie
* @Last Modified time: 2017-11-25 16:40:54
*/
function objectToString(o) {
  return Object.prototype.toString.call(o);
}

module.exports = {
  isArray(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
  },

  isBoolean(arg) {
    return typeof arg === 'boolean';
  },

  isNull(arg) {
    return arg === null;
  },

  isNullOrUndefined(arg) {
    return arg == null;
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

  isUndefined(arg) {
    return arg === void 0;
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

  isFunction(arg) {
    return typeof arg === 'function';
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
  },

  trim(data) {
    if (module.exports.isString(data)) {
      return data.trim();
    } else if (module.exports.isObject(data)) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = module.exports.getTrimedObject(data[key]);
        }
      }
      return data;
    } else if (module.exports.isArray(data)) {
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
      target = module.exports.isArray(args[0]) ? [] : {};
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
        if (module.exports.isArray(copy)) {
          target[name] = module.exports.extend([], copy);
        } else if (module.exports.isObject(copy)) {
          target[name] = module.exports.extend(src && module.exports.isObject(src) ? src : {}, copy);
        } else {
          target[name] = copy;
        }
      }
    }
    return target;
  },

  queryURL(url, key) {
    url = url.replace(/^[^?=]*\?/ig, '').split('#')[0];
    let json = {};
    url.replace(/(^|&)([^&=]+)=([^&]*)/g, function(a, b, key, value) {
      // 对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
      try {
        key = decodeURIComponent(key);
      } catch (e) {}
      try {
        value = decodeURIComponent(value);
      } catch (e) {}

      if (!(key in json)) {
        json[key] = /\[\]$/.test(key) ? [value] : value; // 如果参数名以[]结尾，则当作数组
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
      // 删除掉参数, $.param 则是返回空， 如：let a = {a: undefined, b: 1, c: null} -> a=&b=1
      if (json[p] == null) {
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
}
