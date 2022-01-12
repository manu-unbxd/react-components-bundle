const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
    // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
        test:/\.scss$/,
        use: [{
                loader: MiniCssExtractPlugin.loader,
            }, 
            'css-loader', 
            {
                loader: 'sass-loader',
                options: {
                    includePaths: ['public/css']
                }
            }
        ]
    }, {
        test: /\.stories\.jsx?$/,
        enforce: 'pre',
    });

    config.plugins.push(new MiniCssExtractPlugin({
        chunkFilename: "[id].css",
        filename: "css/[name].css"
    }))

    config.watch = true;

    // Return the altered config
    return config;
};