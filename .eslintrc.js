module.exports = {
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        // "project": "./tsconfig.json",
        "extraFileExtensions": [".vue"],
        "ecmaVersion": 2018,
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        }
    },
    "plugins": [
        "vue",
    ],
    "extends": [
        // "eslint:recommended",
        "plugin:vue/base",
    ],
    "rules": {
    }
}