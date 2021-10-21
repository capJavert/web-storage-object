const WebStorageObject = require('./WebStorageObject');
const WebStorageEnum = require('./WebStorageEnum');

/**
 * SessionStorageObject
 *
 * Binds object to sessionStorage
 *
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside webStorage
 * @param  {boolean} overwrite
 * set this flag if you wish to overwrite existing key if it exits inside webStorage
 * @return {Proxy} Proxy object containing SessionStorageObject handler
 */
const SessionStorageObject = (target, key, overwrite) => new WebStorageObject(
  WebStorageEnum.sessionStorage,
  target,
  key,
  overwrite,
);

module.exports = SessionStorageObject;
