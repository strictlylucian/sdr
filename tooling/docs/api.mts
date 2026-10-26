import ts from 'typescript';
export function readApi() {
  const program = ts.createProgram(['packages/react/src/index.ts'], { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, skipLibCheck: true, strict: true });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile('packages/react/src/index.ts')!;
  const module = checker.getSymbolAtLocation(source)!;
  const result: Record<string, { name: string; type: string; required: boolean }[]> = {};
  for (const symbol of checker.getExportsOfModule(module)) {
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const declaration = target.valueDeclaration;
    if (!declaration) continue;
    const type = checker.getTypeOfSymbolAtLocation(target, declaration);
    const signature = type.getCallSignatures()[0];
    if (!signature?.parameters[0]) continue;
    const props = checker.getTypeOfSymbolAtLocation(signature.parameters[0], declaration);
    result[symbol.name] = props.getProperties().filter(property => property.declarations?.some(item => item.getSourceFile().fileName.replaceAll('\\', '/').includes('/packages/'))).map(property => ({
      name: property.name, required: !(property.flags & ts.SymbolFlags.Optional),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, declaration), declaration, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
    }));
  }
  return result;
}
