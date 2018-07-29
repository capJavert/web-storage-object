var WebStorageEnum = require('./WebStorageEnum');

/**
 * Abstract WebStorageObject type
 * Used in child LocalStorageObject and SessionStorageObject types
 *
 * @param  {WebStorageEnum} type type indicating  WebStorage API to use
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside webStorage
 * @param  {boolean} overwrite set this flag if you wish to overwrite existing key if it exits inside webStorage
 * @return {Proxy} Proxy object containing WebStorageObject handler
 */
var WebStorageObject = function(type, target, key, overwrite) {
  var handler = this._handler(key);
  if(!handler._setStorage(type)) {
    throw "WebStorage type is not valid or supported.";
  }
  if((overwrite && overwrite === true) || handler._fetch() === null) {
    handler._persist(target);
  }
  var proxy = new Proxy(target, handler);
  handler._proxy = proxy;

  return proxy;
}
WebStorageObject.prototype._handler = function(key) {
  return {
    /**
     * Unique identifier for object inside webStorage
     *
     * @type {string}
     */
    _id: key || this._uuid(),
    /**
     * Reference to handlers Proxy object
     * Always set if WebStorageObject is created through constructor function
     *
     * @type {Proxy}
     */
    _proxy: null,
    /**
     * Reference to selected WebStorage type
     *
     * @type {localStorage|sessionStorage}
     */
    _storage: null,
    /**
     * Getter for binded webStorage object properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    get: function (target, key) {
      target = this._fetch();
      if(typeof target[key] === 'object') {
        return new WebStorageProperty(target[key], key, this._proxy);
      } else {
        return target[key] || null;
      }
    },
    /**
     * Setter for binded webStorage object properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    set: function (target, key, value) {
      target[key] = value;
      var temp = this._fetch();
      temp[key] = value;

      return this._persist(temp);
    },
    /**
     * Used to generate random object identifier inside webStorage
     *
     * @return {string}
     */
    _uuid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    /**
     * Save data to webStorage as JSON string
     *
     * @param {object} value
     */
    _persist: function(value) {
      if(value) {
        this._storage.setItem(this._id, JSON.stringify(value));
        return true;
      } else {
        return false;
      }
    },
    /**
     * Get data from webStorage as object
     *
     * @return {object}
     */
    _fetch: function() {
      var temp = this._storage.getItem(this._id);
      return temp ? JSON.parse(temp) : null;
    },
    /**
     * Abstract webStorage setter
     *
     * @type {localStorage|sessionStorage}
     * @return {boolean} Returns false if WebStorage type is not valid or supported
     */
    _setStorage: function(type) {
      switch(type) {
        case WebStorageEnum.localStorage:
          this._storage = localStorage;
          return true;
        case WebStorageEnum.sessionStorage:
          this._storage = sessionStorage;
          return true;
      }

      return false;
    }
  }
}

/**
 * Constructor for creating an object of WebStorageProperty type
 *
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside his parent
 * @param  {Proxy} parent Proxy object of a parent object
 * @return {Proxy} Proxy object containing WebStorageProperty handler
 */
var WebStorageProperty = function(target, key, parent) {
  var handler = this._handler(key, parent);
  var proxy = new Proxy(target, handler);
  handler._proxy = proxy;

  return proxy;
}
WebStorageProperty.prototype._handler = function(key, parent) {
  return {
    /**
     * Unique identifier for property inside webStorage
     *
     * @type {string}
     */
    _id: key,
    /**
     * Reference to handlers Proxy object
     * Always set if WebStorageProperty is created through constructor function
     *
     * @type {Proxy}
     */
    _proxy: null,
    /**
     * Original Proxy that traps this property
     *
     * @type {object}
     */
    _parent: parent,
    /**
     * Getter for binded webStorage property properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    get: function (target, key) {
      if(typeof target[key] === 'object') {
        return new WebStorageProperty(target[key], key, this._proxy);
      } else {
        return target[key] || null;
      }
    },
    /**
     * Setter for binded webStorage property properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    set: function (target, key, value) {
      target[key] = value;
      this._parent[this._id] = target;

      return true;
    }
  }
}

module.exports = WebStorageObject;
