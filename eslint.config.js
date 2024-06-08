import jestDom from "eslint-plugin-jest-dom";

export default [
  {
    files: ["src/**/*.test.ts"],
    ...jestDom.configs["flat/recommended"],
  }
]