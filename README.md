

How to use

```javascript
scrollToFocused.configure({ container : <%= element, or selector %> }).start();
```

Possible config options :
```javascript
config : {
    container : null, // container in which to scroll items into focus.
    focusedSelector : '.focused', // css selector to grab the item that has focus
    moveFocusEvent : 'focus-gained', // event in which to listen for new focus events
    debounce : 500, // how long do you want to debounce your moveFocusEvent, will fire immediate, then wait this time to fire again.
    animate : true // If you want the scroll to animate (provided by Velocity.js)
}
```
