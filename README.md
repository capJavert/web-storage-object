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
Now if you check localStorage inside dev tools of your browser you will see:

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

### Use sessionStorage
To use sessionStorage call the SessionStorageObject constructor.
```
var ogox = new SessionStorageObject(heroModel, 'ogox')
```

### Nested objects
It also works out of the box with nested object properties like:
```
ogox.armor.body = 'Heavy Armor' // updates property inside browser storage
```

### Just like any JavaScript object
You can define new properties just like with any JS object:
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

### Handling data already written inside browser storage
Let's say you already have some data for the given key saved to storage and you just want to load that. You can do it like this:
```
var ogox = new LocalStorageObject({}, 'ogox', false) // overwrite flag set to false
```
If overwrite flag is set to false and no data exists in Storage then in this case constructor would return empty LocalStorageObject object.

### Delete properties
You can use delete operator to delete properties, this will delete property and sync webStorage:
```
delete ogox.armor.hands
delete ogox.level
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
$ npm run build:nouglify
```
or minified version:
```
$ npm run build
```

## Supports:
- [x] Nested Objects
- [x] Arrays
- [x] Nested Arrays
- [x] sessionStorage and localStorage
- [x] **delete** operator
- [x] **Object.hasOwnProperty** method
