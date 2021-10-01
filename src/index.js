/**
 * API providing 2 way binding of JavaScript objects to browser WebStorage
 * Consists of two mechanisms
 * - LocalStorageObject
 * - SessionStorageObject
 *
 * Each is used to bind any JavaScript object to specific WebStorage type
 *
 */

const LocalStorageObject = require('./LocalStorageObject');
const SessionStorageObject = require('./SessionStorageObject');

module.exports = {
  LocalStorageObject,
  SessionStorageObject,
};
