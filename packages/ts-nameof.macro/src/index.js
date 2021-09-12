/// @ts-check
/// <reference path="references.d.ts" />
import { transformNode } from "@ts-nameof/transforms-babel";
import { createMacro, MacroError } from "babel-plugin-macros";

export default createMacro(nameofMacro);

// @ts-ignore
function nameofMacro({ references, state, babel }) {
  // go over in reverse as if traversing in post order
  const reverseDefault = references.default.slice().reverse();

  // @ts-ignore
  reverseDefault.forEach(path => {
    const t = babel.types;
    transformNode(t, getPath(), {
      // tell the transformation to expect this identifier's name
      nameofIdentifierName: path.node.name,
    });

    function getPath() {
      const parentPath = path.parentPath; // identifier;
      if (parentPath.type === "CallExpression") {
        return parentPath;
      }
      const grandParentPath = parentPath.parentPath;
      if (parentPath.type === "MemberExpression" && grandParentPath.type === "CallExpression") {
        return grandParentPath;
      }
      throw new MacroError("[ts-nameof]: Could not find a call expression at path: " + grandParentPath.getSource());
    }
  });
}
