module.exports = {
    parser: 'babel-eslint',
    env: {
        es6: true,
        node: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['./src'],
            },
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    ignorePatterns: ['build/*','**/*.d.ts'],
    rules: {
        semi: ['error', 'always', { omitLastInOneLineBlock: true }],
        'no-unused-vars': 1,
        'spaced-comment': ['error', 'always'],
        'keyword-spacing': ['error', { after: true }],
        'lines-between-class-members': ['error', 'always'],
        'object-property-newline': [
            'error',
            { allowAllPropertiesOnSameLine: true },
        ],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'import/no-unresolved': [2, { commonjs: true, amd: true }],
        'import/named': 2,
        'import/namespace': 0,
        'import/no-self-import': 2,
        'import/first': 2,
        'import/order': 2,
        'import/no-named-as-default': 0,
    },
    overrides: [
        {
            files: ['**/test/**/*.[t|j]s', '**/*.test.[t|j]s'],
            env: {
                es6: true,
                jest: true,
                node: true,
            },
            rules: {
                'no-unused-vars': 0,
                'jest/no-disabled-tests': 0,
                'jest/no-focused-tests': 'error',
                'jest/no-identical-title': 'error',
                'jest/prefer-to-have-length': 'warn',
                'jest/valid-expect': 'error',
            },
            extends: [
                'eslint:recommended',
                'plugin:import/errors',
                'plugin:import/warnings',
                'plugin:jest/recommended',
            ],
        }
    ],
};
