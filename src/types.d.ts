// src/types.d.ts
// Le dice a TypeScript que cualquier archivo .json puede ser importado 
// como si fuera un módulo JavaScript estándar.
declare module '*.json' {
  const value: any;
  export default value;
}