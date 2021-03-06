const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
let config = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: {
        "js/sgds": "./sgds/index.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname)
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            "@babel/plugin-proposal-object-rest-spread"
                        ]
                    }
                }
            },
            {
                // sass -> css -> extract to dist/css
                test: /sgds\.s(a|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "/"
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                // fonts -> file loader to dist/fonts
                test: /sgds-icons\.(svg|ttf|woff)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            moduleFilename: ({ name }) => `${name.replace("js", "css")}.css`
        }),
    ]
};
if (process.env.NODE_ENV === "production") {
    config.plugins.push(new OptimizeCssAssetsPlugin());
    config.devtool = "source-map";
}
module.exports = config;
