const path = require('path');

module.exports = {
    mode: 'production',
    entry: './TypeScript/Implementation/DocumentInitialization.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'scriptbundle.js',
        path: path.resolve(__dirname, 'wwwroot/lib/'),
    },
};