const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry:path.resolve(__dirname,"src/index.tsx"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use:'ts-loader'
            },
            {
                test: /\.ttf/i,
                exclude: /node_modules/,
                loader:"file-loader",
                options: {
                    name: 'fonts/ttf/[name]-[contenthash:5].[ext]',
                },
            },{
                test: /\.woff2?/i,
                exclude: /node_modules/,
                loader:"file-loader",
                options: {
                    name: 'fonts/woff2/[name]-[contenthash:5].[ext]',
                },
            },{
                test: /\.eot$/i,
                exclude: /node_modules/,
                loader:"file-loader",
                options: {
                    name: 'fonts/eot/[name]-[contenthash:5].[ext]',
                },
            },{
                test: /\.(jpe?g|png|svg)$/i,
                exclude: /node_modules/,
                loader:"file-loader",
                options: {
                    name: 'images/[name]-[contenthash:5].[ext]',
                },
            },/*{
                test: /\.svg$/i,
                exclude: /node_modules/,
                loader:"file-loader",
                options: {
                    name: 'images/svg/[name]-[contenthash].[ext]',
                }
            },*/{
                test: /.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "targets": {
                                        "browsers": ["last 2 Chrome versions"]
                                    }
                                }
                            ],
                            "@babel/preset-react"
                        ],
                        plugins: [
                            '@babel/transform-runtime'
                        ]
                    }
                }
            },{
                test: /\.s[ac]ss$|\.css$/i,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ]
            }
        ]
    },
    optimization:{
        splitChunks:{
            chunks: 'async'
        },
        chunkIds: "size",
        moduleIds: "size",
        mangleExports: "size"
    },
    performance:{
        hints: false
    },
    devtool:'hidden-source-map',
    target:"web",
    plugins:[
        new MiniCssExtractPlugin({
            filename:"all.css"
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: __dirname + "/build",
        filename: "bundle.js",
        publicPath: "",
        clean: true
    }
};