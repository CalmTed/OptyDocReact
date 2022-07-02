module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unexpected-multiline":"error",
    "no-irregular-whitespace":"error",
    "no-duplicate-imports":"error",
    "getter-return":"error",
    "camelcase":"error",
    "curly":"error",
    "default-case-last":"error",
    "eqeqeq":"error",
    "max-lines-per-function": ["warn",
      200],
    "max-depth": ["error",
      7],
    "no-magic-numbers":["warn",
      {"ignoreArrayIndexes": true}],
    "no-underscore-dangle":["error",
      {"allowFunctionParams": true}],
    "arrow-spacing":"error",
    "block-spacing":"error",
    "array-bracket-spacing":"error",
    "array-element-newline":"off",
    "comma-dangle":"error",
    "comma-spacing":"error",
    "object-curly-spacing":"error",
    "object-property-newline":"error",
    "semi-spacing":"error",
    "space-before-blocks":"error",
    "space-before-function-paren":"error",
    "space-unary-ops":"error",
    "space-in-parens":"error",
    "space-infix-ops":"error",
    "no-case-declarations":"off",
    "react/prop-types":"off",
    "react/no-render-return-value":"off"
  }
};
