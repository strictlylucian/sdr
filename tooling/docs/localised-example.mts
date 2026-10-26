import ts from 'typescript';
import enExamples from '../../apps/docs/src/i18n/en/examples.json';
import roExamples from '../../apps/docs/src/i18n/ro/examples.json';
import enUi from '../../apps/docs/src/i18n/en/ui.json';
import roUi from '../../apps/docs/src/i18n/ro/ui.json';
import enComponents from '../../apps/docs/src/i18n/en/components.json';
import roComponents from '../../apps/docs/src/i18n/ro/components.json';
type Locale = 'ro' | 'en';
const dictionaries: Record<string, Record<Locale, Record<string, string>>> = {
  tr: { en: enExamples, ro: roExamples }, uiText: { en: enUi, ro: roUi }, componentText: { en: enComponents, ro: roComponents },
};
const literal = (text: string) => ts.setEmitFlags(ts.factory.createStringLiteral(text, true), ts.EmitFlags.NoAsciiEscaping);

/** Public snippets show localised copy, rather than internal docs dictionary keys/imports. */
export function localiseExample(node: ts.FunctionDeclaration, source: ts.SourceFile, locale: Locale) {
  const result = ts.transform(node, [context => root => {
    const visit: ts.Visitor = child => {
      if (ts.isJsxAttribute(child) && child.initializer && ts.isJsxExpression(child.initializer) && child.initializer.expression) {
        const expression = ts.visitNode(child.initializer.expression, visit) as ts.Expression;
        return ts.factory.updateJsxAttribute(child, child.name, ts.isStringLiteral(expression)
          ? literal(expression.text) : ts.factory.updateJsxExpression(child.initializer, expression));
      }
      if (ts.isJsxExpression(child) && child.expression) {
        const expression = ts.visitNode(child.expression, visit) as ts.Expression;
        if (ts.isStringLiteral(expression) && !/[<>{}&\n]/.test(expression.text)) return ts.factory.createJsxText(expression.text);
        return ts.factory.updateJsxExpression(child, expression);
      }
      if (ts.isCallExpression(child)) {
        const helper = child.expression.getText(source), key = child.arguments[1];
        if (helper === 'docsUrl') return ts.visitNode(child.arguments[0], visit);
        if (helper === 'countText') return ts.factory.createCallExpression(ts.factory.createIdentifier('formatCount'), undefined, [key]);
        if (Object.hasOwn(dictionaries, helper) && key && ts.isStringLiteralLike(key)) {
          const message = dictionaries[helper][locale][key.text];
          if (message === undefined) throw new Error(`Missing snippet translation ${locale}:${key.text}`);
          const values: Record<string, ts.Expression> = {};
          const params = child.arguments[2];
          if (params && ts.isObjectLiteralExpression(params)) for (const prop of params.properties) {
            if (ts.isPropertyAssignment(prop)) values[prop.name.getText(source)] = prop.initializer;
          }
          const parts = message.split(/\{(\w+)\}/g);
          if (parts.length === 1) return literal(message);
          const spans: ts.TemplateSpan[] = [];
          for (let index = 1; index < parts.length; index += 2) {
            const value = values[parts[index]];
            if (!value) throw new Error(`Missing snippet interpolation ${parts[index]}`);
            spans.push(ts.factory.createTemplateSpan(value, index + 2 === parts.length
              ? ts.factory.createTemplateTail(parts[index + 1]) : ts.factory.createTemplateMiddle(parts[index + 1])));
          }
          return ts.factory.createTemplateExpression(ts.factory.createTemplateHead(parts[0]), spans);
        }
      }
      return ts.visitEachChild(child, visit, context);
    };
    return ts.visitNode(root, visit) as ts.FunctionDeclaration;
  }]);
  const transformed = result.transformed[0];
  const standalone = ts.factory.updateFunctionDeclaration(transformed, transformed.modifiers, transformed.asteriskToken,
    transformed.name, transformed.typeParameters, [], transformed.type, transformed.body);
  const output = ts.createPrinter().printNode(ts.EmitHint.Unspecified, standalone, source);
  result.dispose();
  return output;
}
