module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
    'no-unused-vars': WARN,
    'no-unused-expressions': IGNORE,
  },
};
