1..What is the difference between var, let, and const?
Ans: *In the var → Function-scoped, allows redeclaration, gets hoisted (can be accessed before initialization but will be undefined).
*In the let → Block-scoped, does not allow redeclaration in the same scope, hoisted but not initialized (Temporal Dead Zone).
*In the const → Block-scoped, must be initialized at declaration, value cannot be reassigned (but objects/arrays can still be mutated).
That's the difference between all of them.


2.. What is the difference between map(), forEach(), and filter()??
Ans:1.In the map() → Transforms each element and returns a new array with the same length.
	2.In terms of forEach() → Iterates over elements, executes a callback, but returns undefined (no new array).
	3.When it comes to filter() → Returns a new array with only elements that pass the condition.

3..What are arrow functions in ES6?
Ans:An arrow function is a shorter and cleaner way to write functions in JavaScript (introduced in ES6).

4..How does destructuring assignment work in ES6?
Ans:Destructuring is a syntax in ES6 which lets you unpack values from arrays or objects into separate variables in a clean and easy way.

5..Explain template literals in ES6. How are they different from string concatenation?
Ans:Template literals are a modern way of working with strings introduced in ES6.
Template literals use backticks (`) and ${} for cleaner variable/expressions and multi-line support.On the other side string concatenation uses + and escape characters, making it less readable.
