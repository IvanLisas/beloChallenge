module.exports = {
  env: {
    node: true,
    commonjs: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    camelcase: [2, { properties: 'always' }],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    'no-unused-vars': ['off']
  }
}
