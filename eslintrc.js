// .eslintrc.js
module.exports = {
    extends: [
        'react-app',
        'plugin:prettier/recommended', // 👈 Add this
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error', // 👈 Show Prettier errors as ESLint errors
    },
};
