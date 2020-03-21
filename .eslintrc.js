module.exports = {
  extends: "airbnb-base",
  rules: {
    "object-curly-newline": "off",
    "block-scoped-var": 0,
    "padded-blocks": 0,
    "comma-dangle": 0,
    indent: [2, 2, { "SwitchCase": 1 }],
    strict: 0,
    "no-console": 0,
    "no-param-reassign": [2, { "props": false }],
    "max-len": [2, 180, 2, { "ignoreUrls": true }],
    "no-unused-expressions": 0,
    "no-case-declarations": 0,
    "no-multi-assign": 0,
    "new-cap": 0,
    "arrow-parens": "warn",
    "no-floating-decimal": "off",
    "one-var-declaration-per-line": "off",
    "one-var": "off"
  },
  globals: {
    "MS_CONFIG": true,
    "describe": true,
    "it": true,
    "before": true,
    "after": true,
    "actions": true,
    "document": true,
    "supertest": true,
    "expect": true,
    "chance": true,
    "sinon": true,
    "beforeEach": true,
    "afterEach": true,
    "THREE": true,
    "window": true,
    "onmousedown": true,
    "onmouseup": true,
    "onmousemove": true,
    "onkeydown": true,
    "onkeyup": true,
    "onmousewheel": true,
    "oncontextmenu": true,
    "requestAnimationFrame": true,
  }
}