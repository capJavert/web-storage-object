var WebStorageObject = require('./WebStorageObject');
var WebStorageEnum = require('./WebStorageEnum');

/**
 * LocalStorageObject
 *
 * Binds object to localStorage
 *
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside webStorage
 * @param  {boolean} overwrite set this flag if you wish to overwrite existing key if it exits inside webStorage
 * @return {Proxy} Proxy object containing LocalStorageObject handler
 */
var LocalStorageObject = function(target, key, overwrite) {
  return new WebStorageObject(
    WebStorageEnum.localStorage,
    target,
    key,
    overwrite
  );
}

module.exports = LocalStorageObject;
