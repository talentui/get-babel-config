// const envConst = require("../constants.js");
const path = require('path');
module.exports = function (options = {}) {
    let {
        targetBrowsers,
        targets: tgt,
        transformInclude = [],
        transformExclude = [],
        engines = ['react']
    } = options;

    let strDev = 'development';
    const env = process.env.NODE_ENV || 'development';

    let isDev = env === strDev;

    const userHasDefinedTargets = !!(targetBrowsers || tgt);

    // // 如果没有传递目标浏览器，则配置支持使用chrome > 58版本，减少plugins和polyfills的数量
    targets = tgt || {
        browsers: targetBrowsers || "chrome >= 58"
    };
    //如果配置了targets， 测不使用内置plugins
    const innerPlugins = userHasDefinedTargets
        ? []
        : require("./data/plugins.json");
    // 在innerPlugins和用户配置的include中去掉重复的部分。
    let includeFeature = require("lodash.uniq")([
        ...innerPlugins,
        ...transformInclude
    ]);
    // 如果用户配置了transformExclude与include特性有重复的话，去掉include中的重复的
    if (transformExclude.length)
        includeFeature = require("./array-compete.js")(
            transformExclude,
            includeFeature
        );

    let presets = [
        [
            "env",
            {
                targets,
                modules: env === 'test' ? "commonjs" : false,
                include: includeFeature,
                exclude: transformExclude,
                useBuiltIns: true,
                debug: isDev
            }
        ],
        "stage-0",
    ], plugins = ["transform-decorators-legacy"];

    let hasReact = engines.indexOf('react') !== -1;

    if (hasReact) {
        presets.push('react');
        if (isDev) {
            plugins.push("transform-react-jsx-source");
        }
    };

    return {
        presets,
        plugins
    };
};
