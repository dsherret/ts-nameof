import { throwError } from "@ts-nameof/common";
import * as ts from "typescript";

export function isNegativeNumericLiteral(node: ts.Node): node is ts.PrefixUnaryExpression {
  if (!ts.isPrefixUnaryExpression(node)) {
    return false;
  }

  return node.operator === ts.SyntaxKind.MinusToken
    && ts.isNumericLiteral(node.operand);
}

export function getNegativeNumericLiteralValue(node: ts.PrefixUnaryExpression) {
  if (node.operator !== ts.SyntaxKind.MinusToken || !ts.isNumericLiteral(node.operand)) {
    return throwError("The passed in PrefixUnaryExpression must be for a negative numeric literal.");
  }

  const result = parseFloat(node.operand.text);
  if (isNaN(result)) {
    return throwError(`Unable to parse negative numeric literal: ${node.operand.text}`);
  }
  return result * -1;
}

export function getReturnStatementExpressionFromBlock(block: ts.Block) {
  for (const statement of block.statements) {
    if (ts.isReturnStatement(statement) && statement.expression != null) {
      return statement.expression;
    }
  }

  return undefined;
}

// todo: remove the use of the printer except for exceptions
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

export function getNodeText(node: ts.Node, sourceFile: ts.SourceFile) {
  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
}
