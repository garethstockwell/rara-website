module.exports = {
  extends: ["plugin:@wordpress/eslint-plugin/recommended"],
  rules: {
    // Custom rules here
    "no-console": "off",
    "no-undef": "warn",
    "jsdoc/no-undefined-types": "warn",
    "jsdoc/require-param-type": "warn",
    "jsdoc/require-returns-type": "warn",
    "jsdoc/require-returns-description": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
  },
};
