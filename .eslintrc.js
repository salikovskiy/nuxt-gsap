module.exports = {
    env: {
        node: true,
    },
    extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
    rules: {
        quotes: ["error", "double"],
        semi: ["error", "never"],
        indent: ["error", 4],
        "no-multi-spaces": ["error"],
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                exports: "always-multiline",
                functions: "never",
                imports: "always-multiline",
                objects: "always-multiline",
            },
        ],
        "no-unused-vars": "off",
        "vue/multi-word-component-names": "off",
    },
}
