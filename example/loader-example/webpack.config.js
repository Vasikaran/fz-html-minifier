const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: path.join(__dirname, '..', '..', 'lib', 'loader'),
                        options: {
                            
                        }
                    }
                ]
            }
        ]
    }
}
