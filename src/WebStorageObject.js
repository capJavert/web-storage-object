const WebStorageEnum = require('./WebStorageEnum');

/**
 * Abstract WebStorageObject type
 * Used in child LocalStorageObject and SessionStorageObject types
 *
 * @param  {WebStorageEnum} type type indicating  WebStorage API to use
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside webStorage
 * @param  {boolean} overwrite Defaults to true, unset this flag to keep
 *  existing data if the key already exists inside webStorage
 * @return {Proxy} Proxy object containing WebStorageObject handler
 */
const WebStorageObject = function (type, target, key, overwrite = true) {
  const handler = this._handler(key);
  if (!handler._setStorage(type)) {
    throw new Error('WebStorage type is not valid or supported.');
  }
  if (overwrite === true || handler._fetch() === null) {
    handler._persist(target);
  } else {
    target = handler._fetch();
  }
  const proxy = new Proxy(target, handler);
  handler._proxy = proxy;

  if (window) {
    window.addEventListener('storage', () => {
      handler._reflect();
    });
  }

  return proxy;
};
WebStorageObject.prototype._handler = function (key) {
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
    get(target, key) {
      switch (key) {
        case 'toJSON':
          return this.toJSON.bind(this);
        case 'toPlain':
          return this.toPlain.bind(this);
        case 'toString':
          return target.toString;
        case 'toLocaleString':
          return target.toLocaleString;
        case 'hasOwnProperty':
          target = this._fetch();
          return target.hasOwnProperty;
        default:
          target = this._fetch();
          if (typeof target[key] === 'object') {
            return new WebStorageProperty(target[key], key, this._proxy);
          }
          return Object.prototype.hasOwnProperty.call(target, key) ? target[key] : null;
      }
    },
    /**
     * Setter for binded webStorage object properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {boolean}
     */
    set(target, key, value) {
      target[key] = value;
      const temp = this._fetch();
      temp[key] = value;

      return this._persist(temp);
    },
    /**
     * Delete operator handler
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {boolean}
     */
    deleteProperty(target, key) {
      if (key in target) {
        delete target[key];
        return this._persist(target);
      }
      return false;
    },
    /**
     * Used to generate random object identifier inside webStorage
     *
     * @return {string}
     */
    _uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0; const
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    /**
     * Save data to webStorage as JSON string
     *
     * @param {object} value
     */
    _persist(value) {
      if (value) {
        this._storage.setItem(this._id, JSON.stringify(value));
        return true;
      }
      return false;
    },
    /**
     * Get data from webStorage as object
     *
     * @return {object}
     */
    _fetch() {
      const temp = this._storage.getItem(this._id);
      return temp ? JSON.parse(temp) : null;
    },
    /**
     * Abstract webStorage setter
     *
     * @type {localStorage|sessionStorage}
     * @return {boolean} Returns false if WebStorage type is not valid or supported
     */
    _setStorage(type) {
      switch (type) {
        case WebStorageEnum.localStorage:
          this._storage = localStorage;
          return true;
        case WebStorageEnum.sessionStorage:
          this._storage = sessionStorage;
          return true;
        default:
          return false;
      }
    },
    /**
     * Reflect all values from WebStorage to proxy internal target object
     */
    _reflect() {
      const temp = this._fetch();
      for (const key in temp) {
        this._proxy[key] = temp[key];
      }
    },
    /**
     * Return plain JSON string
     *
     * @return {string} [description]
     */
    toJSON() {
      return this._storage.getItem(this._id) || '{}';
    },
    /**
     * Return plain object (without nested Proxys)
     * @return {object}
     */
    toPlain() {
      return this._fetch();
    },
  };
};

/**
 * Constructor for creating an object of WebStorageProperty type
 *
 * @param  {object} target object or array defining object properties
 * @param  {string} key key that will identifiy object inside his parent
 * @param  {Proxy} parent Proxy object of a parent object
 * @return {Proxy} Proxy object containing WebStorageProperty handler
 */
let WebStorageProperty = function (target, key, parent) {
  const handler = this._handler(key, parent);
  const proxy = new Proxy(target, handler);
  handler._proxy = proxy;

  return proxy;
};
WebStorageProperty.prototype._handler = function (key, parent) {
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
    get(target, key) {
      switch (key) {
        case 'toJSON':
          return function () {
            return JSON.stringify(target);
          };
        case 'toPlain':
          return function () {
            return target;
          };
        case 'toString':
          return target.toString;
        case 'toLocaleString':
          return target.toLocaleString;
        case 'hasOwnProperty':
          return target.hasOwnProperty;
        default:
          if (typeof target[key] === 'object') {
            return new WebStorageProperty(target[key], key, this._proxy);
          }
          return Object.prototype.hasOwnProperty.call(target, key) ? target[key] : null;
      }
    },
    /**
     * Setter for binded webStorage property properties
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {boolean}
     */
    set(target, key, value) {
      target[key] = value;
      this._parent[this._id] = target;

      return true;
    },
    /**
     * Delete operator handler
     *
     * @param  {object} target
     * @param  {string|number} key
     * @return {boolean}
     */
    deleteProperty(target, key) {
      if (key in target) {
        delete target[key];
        this._parent[this._id] = target;

        return true;
      }
      return false;
    },
    /**
      * Return plain JSON string
      *
      * @return {string} [description]
      */
    toJSON() {
      return JSON.stringify(this);
    },
    /**
      * Return plain object (without nested Proxys)
      * @return {object}
      */
    toPlain() {
      return this;
    },
  };
};

module.exports = WebStorageObject;
