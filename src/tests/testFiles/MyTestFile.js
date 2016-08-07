import * as fs from "fs";

var myVariable = "";

console.log(nameof(myVariable));
console.log(nameof(window.alert));

function withinFunction() {
    console.log(nameof(withinFunction));
}
