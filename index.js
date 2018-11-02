// const envConst = require("../constants.js");
const path = require("path");
module.exports = function(options = {}) {
    let {
        targets: tgt,
        transformInclude = [],
        engines = ["react"],
        loose = true,
        modules = false
    } = options;

    let strDev = "development";
    const env = process.env.NODE_ENV || "development";

    let isDev = env === strDev;

    // const userHasDefinedTargets = !!(targetBrowsers || tgt);

    // // 如果没有传递目标浏览器，则配置支持使用chrome > 58版本，减少plugins和polyfills的数量
    // targets = tgt || {
    //     browsers: targetBrowsers || "chrome >= 58"
    // };
    // //如果配置了targets， 测不使用内置plugins
    // const innerPlugins = userHasDefinedTargets
    //     ? []
    //     : require("./data/plugins.json");
    // // 在innerPlugins和用户配置的include中去掉重复的部分。
    // let includeFeature = require("lodash.uniq")([
    //     ...innerPlugins,
    //     ...transformInclude
    // ]);
    targets = tgt || {
        chrome: '45',
        edge: '14',
        ie: '10'
    }

    let presets = [
            [
                "@babel/preset-env",
                {
                    targets,
                    modules: env === "test" ? "commonjs" : modules,
                    include: transformInclude,
                    useBuiltIns: "usage",
                    debug: isDev,
                    loose
                }
            ]
        ],
        plugins = [
            "@babel/plugin-syntax-dynamic-import",
            ["@babel/plugin-proposal-decorators", {
                legacy: true
            }],
            ["@babel/plugin-proposal-class-properties", {
                loose
            }],
            "@babel/plugin-transform-runtime"
        ];

    let hasReact = engines.indexOf("react") !== -1;

    if (hasReact) {
        presets.push([
            "@babel/preset-react",
            {
                development: isDev
            }
        ]);
    }

    return {
        presets,
        plugins
    };
};
