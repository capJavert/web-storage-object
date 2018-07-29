/**
 * API providing 2 way binding of JavaScript objects to browser WebStorage
 * Consists of two mechanisms
 * - LocalStorageObject
 * - SessionStorageObject
 *
 * Each is used to bind any JavaScript object to specific WebStorage type
 *
 */

var LocalStorageObject = require('./LocalStorageObject');
var SessionStorageObject = require('./SessionStorageObject');

module.exports = {
  LocalStorageObject: LocalStorageObject,
  SessionStorageObject: SessionStorageObject
}
