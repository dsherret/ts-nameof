/// <reference path="../ts-nameof.d.ts" />
/* istanbul ignore next */
import tsNameOf = require("ts-nameof");
import { assert, IsExact } from "conditional-type-checks";
import * as tsNameOfEs6 from "ts-nameof";

/* istanbul ignore next */
function testFunc() {
  tsNameOf.replaceInFiles(["test"]);
  tsNameOf.replaceInFiles(["test"]).then(() => {});

  // replaceInText
  const replaceInTextResult = tsNameOf.replaceInText("fileName.ts", "const t = 5;");
  console.log(replaceInTextResult);
  assert<IsExact<typeof replaceInTextResult.fileText, string | undefined>>(true);
  assert<IsExact<typeof replaceInTextResult.replaced, boolean>>(true);

  // es6 test
  const es6Result = tsNameOfEs6.replaceInText("file.ts", "");
  console.log(es6Result.replaced);
}
