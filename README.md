# WebStorage object API
API providing 2 way binding of JavaScript objects to browser WebStorage
API consists of two mechanisms, each is used to bind and persist any JavaScript object to specific WebStorage type:
- LocalStorageObject -> localStorage
- SessionStorageObject -> sessionStorage

## Getting started
Include with script tag:
```
<script src="dist/web-storage-object.min.js"></script>
```
or if you prefer NPM:
```
npm install web-storage-object
```
and include as:
```
import {LocalStorageObject, SessionStorageObject} from 'web-storage-object'
```

## Examples
### Basic usage
Given the simple object representing our data we can use the API like this:
```
var heroModel = {
  name: 'Ogox',
  weapon: 'Axe',
  horse: true,
  armor: {
    head: 'Steel Helmet',
    body: 'Rags',
    boots: 'Wraps'
  }
}
var ogox = new LocalStorageObject(heroModel, 'ogox')
```
Not if you check localStorage inside dev tools of your browser you will see:

![Chrome DevTools showcase](https://i.imgur.com/8A3r8Nl.png "Chrome DevTools")

Now if we modify any ogox ~~weapon~~ property, lets say like this:
```
ogox.weapon = 'Heavy Axe'
```
The changes will be automatically persistant and changed inside localStorage. You can check your dev tools again. Also if you do:
```
console.log(ogox)
console.log(ogox.weapon)
```
As you can see it behaves just as any other object except with help of JavaScript Proxy object changes are saved and fetched from WebStorage.

### Nested objects
It also works out of the box with nested object properties like:
```
ogox.armor.body = 'Heavy Armor' // updates property inside browser storage
```

### Just like any JavaScript object
You can define new attributes just like with any JS object:
```
ogox.armor.hands = 'Shoulder Plates'
ogox.level = 42
```

### It also supports arrays and key => value syntax
```
ogox.items = [
  'carrot',
  'spoon',
  'rotten meat'
]
console.log(ogox.items[1]) // prints 'spoon' to console
```

## Build your own
You can use files inside /dist folder or build your own.
```
$ git clone https://github.com/capJavert/web-storage-object.git
$ web-storage-object
$ npm install
```
Build scripts are:
```
$ npm run build
```
or minified version:
```
$ npm run build_prod
```

## TODO
* ~~Nested objects support~~
* ~~Array support~~ - Solved by adding nested object support, JS arrays are objects with special behaviour and Proxy handles them the same way
* ~~Nested Array support~~ - Solved with previous point
* ~~abstract to WebStorageObject and provide SessionStorageObject and LocalStorageObject~~
* Add support for delete operator
* Add support for Object.hasOwnProperty
