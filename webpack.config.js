const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fse = require("fs-extra");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-conditionals"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("postcss-extend"),
  require("postcss-logical")(),
  require("postcss-color-mod-function"),
  require("postcss-preset-env"),
  require("postcss-rem")({
    baseline: 10, // Default to 16
    precision: 3, // Default to 5
  }),
  require("postcss-calc")({
    precision: 3,
  }),
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy files", function () {
      fse.copySync("./app/assets/images", "./dist/assets/images");
      fse.copySync("./app/assets/fonts", "./dist/assets/fonts");

      /*
        If you needed to copy another file or folder
        such as your "images" folder, you could just
        call fse.copySync() as many times as you need
        to here to cover all of your files/folders.
      */
    });
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    {
      loader: "css-loader", //2. Turns css into common js
      options: {
        url: false,
      },
    },
    {
      loader: "postcss-loader", //1. Turns postCSS into regular css
      options: {
        parser: require("postcss-comment"),
        plugins: postCSSPlugins,
      },
    },
  ],
};

config = {
  entry: "./app/App.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "app"),
    filename: "bundled.js",
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "app/index-template.html",
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  mode: "development",
  module: {
    rules: [
      cssConfig,
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              ["@babel/preset-env", { targets: { node: "12" } }],
            ],
          },
        },
      },
    ],
  },
};

if (currentTask == "webpackDev" || currentTask == "dev") {
  config.devtool = "source-map";
  config.devServer = {
    port: 3000,
    contentBase: path.join(__dirname, "app"),
    hot: true,
    historyApiFallback: { index: "index.html" },
  };
  cssConfig.use.unshift("style-loader"); //3. Inject styles into DOM
  config.plugins.push(
    new StylelintPlugin({
      configFile: ".stylelintrc.json",
      context: "./app",
      files: "**/*.css",
      syntax: "scss",
      failOnError: false,
      quiet: false,
      emitErrors: true, // by default this is to true to check the CSS lint errors
    })
  );
}

if (currentTask == "webpackBuild") {
  cssConfig.use.unshift(MiniCSSExtractPlugin.loader); //3. Extract css into files
  postCSSPlugins.push(require("cssnano"));
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      filename: "assets/styles/main.[chunkhash].css",
    }),
    new RunAfterCompile()
  );
  config.mode = "production";
  config.output = {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  };
}

module.exports = config;
