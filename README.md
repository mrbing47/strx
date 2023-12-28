# strx

Yet another flexible template engine.

You can simply store and pass values to the produce the final string. Use templates in your string by using `{}`.

## Basic

-   The program adds the data to the template brackets based on a predefined flow. The function will take it's first argument as the
    **template string** and then either return a function to pass the data or a string if all the templates have received the data.

-   The data is passed as normal arguments to the function, all non object data are added in an array whereas all the objects are combined together.

-   The indexes are greedy and will grab the data for themselves. You can defined same index and keys multiple times.

-   Indexes have a tendency of rolling, that is they will if the value is not available, then the index will roll towards zero
    until the value if found.

## Escape Character

To escape the brackets and prevent yourself from errors, use `{{` and `}}`
and the code will treat the brackets like normal characters.

```Javascript
strx("{~message~} {~name~} {{🙃}}", "Hello", "Node");
>> Hello Node {🙃}
```

## Referencing

-   ### Empty

You can simply use `{}` where you want to substitute data in the string. The data will be picked and placed from `left to right`. Brackets with comments **( eg. {\~message\~}` )** will be also **treated as empty brackets**.

```Javascript
strx("{} {} {} {}", "A")("B", "C", "D")
>> A B C D
```

-   ### Comments

You can use comments in `{}` by writing the text between `~` for better readability. They will be treated same as empty brackets.

```Javascript
strx("{~message~} {~name~}", "Hello", "Node");
>> Hello Node

strx("{~resource~} {}", "Memory", "Stack Overflow");
>> Memory Stack Overflow
```

-   ### Indexes

Sometimes the order of passed elements does not match their order in the string. Use Indexes starting from **`0`** and the function will replace the passed Strings or Data from `left to right` as if they are in an array.

```Javascript
strx("{1} {3} {2} {0}", "A", "B", "C", "D")
>> B D C A
```

```Javascript
strx("{1} {3} {2} {0} {4[1]} {4[0]}", "A", "B", "C", "D", ["E", "F"])
>> B D C A E F
```

-   ### Keys

You can also pass valid JS `keys` between the `{}` and then pass the JS Object to
with the same keys and their values. Values will be overridden from `left to right`.

```Javascript
strx("{message} {name}", { message: "Hello", name: "Nathan" })
>> Hello Nathan
```

Here you can also pass the key as a nested object.

```Javascript
strx("{message} {info.name.first}", { message: "Hello", info: { name: {
    first: "Nathan",
    last: "Drake"
}}})
>> Hello Nathan
```

With the nested objects, there will be arrays and you will be able to pass those array indexes too.

```Javascript
strx("{fruit[1]} is tasty 🤤.", { fruit: [ "Banana", "Apple", "Orange"] })
>> Apple  is tasty 🤤.
```

Try combining it with [chalk.js](https://www.npmjs.com/package/chalk) to see the different possibilities.

## Rolling Index Example

Following is an example of rolling index.

```Javascript
strx("{1} {2} {0} {} {} {6} {7}")(1, 2, 3, 4, 5, 6, 7, 8)
>> 2 3 1 4 5 7 8
```

## Usage

The `strx()` function will take a string as it's first argument and optional `...args` as data to place inside string. Until all the templates are satisfied, ie, have data value other than `undefined`. The function will return another function for the user to enter the values. Once all the templates have a value other than `undefined`, the function will return a string.

```Javascript

const strx = require("strx")

const consoleFormat = strx("{~LEVEL~}: {~TYPE~} {~detailed error message~}");

const warn = consoleFormat("WARN");
const error = consoleFormat("ERROR");


const stackOverflow = error("STACK_OVERFLOW")

console.log(stackOverflow("Maximum recursion stack is reached."))
// ERROR: STACK_OVERFLOW Maximum recursion stack is reached.

```

## APIS

### Current State

Current state of the `templates` in returned function:

```Javascript
const message = strx("{~message~} {~name~}", "Hello");
console.log(message.templates);
>> {
  empty: [
    {
      key: "~message~",
      start: 0,
      length: 11,
      value: "Hello",
    }, {
      key: "~name~",
      start: 12,
      length: 8,
      value: undefined,
    }
  ],
  array: [],
  key: [],
}
```
