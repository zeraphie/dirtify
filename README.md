# Dirtify
This class determines whether or not the page has any 'dirty' input fields (input/textarea/select elements)

*Dirty:* current input is different to that of when the page was loaded

## Demo
I've made a demo to be tested at https://codepen.io/zephyr/pen/oWxvMW

## Usage
This class utilizes the NodeList.prototype.forEach method, so it is recommended to include the [polyfill](forEach.polyfill.js) for it prior to the when the class is loaded

The setup is pretty basic, just follow the steps below when using ES6

```javascript
import Dirtify from "dirtify";
let dirtify = new Dirtify();
dirtify.setup();
```
