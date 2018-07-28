/**
 * API providing 2 way binding of JavaScript objects to browser LocalStorage
 *
 * @type {Object}
 */

/**
 * Constructor for creating an object of LocalStorageObject type
 *
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside localStorage
 * @param  {boolean} overwrite set this flag if you wish to overwrite existing key if it exits inside localStorage
 * @return {Proxy} Proxy object containing LocalStorageObject handler
 */
var LocalStorageObject = function(target, key, overwrite) {
  var handler = this._handler(key);
  if((overwrite && overwrite === true) || handler._fetch() === null) {
    handler._persist(target);
  }
  var proxy = new Proxy(target, handler);
  handler._proxy = proxy;

  return proxy;
}
LocalStorageObject.prototype._handler = function(key) {
  return {
    /**
     * Unique identifier for object inside localStorage
     *
     * @type {string}
     */
    _id: key || this._uuid(),
    /**
     * Reference to handlers Proxy object
     * Always set if LocalStorageObject is created through constructor function
     *
     * @type {Proxy}
     */
    _proxy: null,
    /**
     * Getter for binded localStorage object properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    get: function (target, key) {
      target = this._fetch();
      if(typeof target[key] === 'object') {
        return new LocalStorageProperty(target[key], key, this._proxy);
      } else {
        return target[key] || null;
      }
    },
    /**
     * Setter for binded localStorage object properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    set: function (target, key, value) {
      var target = this._fetch();
      target[key] = value;

      this._persist(target);
    },
    /**
     * Used to generate random object identifier inside localStorage
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
     * Save data to localStorage as JSON string
     *
     * @param {object} value
     */
    _persist: function(value) {
      if(value) {
        localStorage.setItem(this._id, JSON.stringify(value));
      }
    },
    /**
     * Get data from localStorage as object
     *
     * @return {object}
     */
    _fetch: function() {
      var temp = localStorage.getItem(this._id);
      return temp ? JSON.parse(temp) : null;
    }
  }
}

/**
 * Constructor for creating an object of LocalStorageProperty type
 *
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside his parent
 * @param  {Proxy} parent Proxy object of a parent object
 * @return {Proxy} Proxy object containing LocalStorageProperty handler
 */
var LocalStorageProperty = function(target, key, parent) {
  var handler = this._handler(key, parent);
  var proxy = new Proxy(target, handler);
  handler._proxy = proxy;

  return proxy;
}
LocalStorageProperty.prototype._handler = function(key, parent) {
  return {
    /**
     * Unique identifier for property inside localStorage
     *
     * @type {string}
     */
    _id: key,
    /**
     * Reference to handlers Proxy object
     * Always set if LocalStorageProperty is created through constructor function
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
     * Getter for binded localStorage property properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    get: function (target, key) {
      if(typeof target[key] === 'object') {
        return new LocalStorageProperty(target[key], key, this._proxy);
      } else {
        return target[key] || null;
      }
    },
    /**
     * Setter for binded localStorage property properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {any}
     */
    set: function (target, key, value) {
      target[key] = value;
      this._parent[this._id] = target;
    }
  }
}
