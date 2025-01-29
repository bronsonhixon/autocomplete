const path = require("path");

module.exports = {
    entry: "./src/index.ts", // Entry point of your app
    output: {
        filename: "bundle.js", // The output file name
        path: path.resolve(__dirname, "public"), // Directory for the output file
    },
    resolve: {
        extensions: [".ts", ".js"], // Resolve .ts and .js files
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Process .ts files
                use: "ts-loader",
                exclude: /node_modules/, // Exclude node_modules
            },
        ],
    },
    mode: "development", // Set mode to development
};