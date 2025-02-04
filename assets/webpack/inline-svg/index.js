const { parseRuleDefinition, getRuleParams, resolvePath, findLoader } = require('./utils');
const load = require('./loader');
const valueParser = require('postcss-value-parser');

/**
 * @typedef {import('postcss').Plugin} Plugin
 * @typedef {import('postcss').PluginOptions} PluginOptions
 * @typedef {import('postcss').AtRule} AtRule
 * @typedef {import('postcss').Declaration} Declaration
 */

/** @type {(opts?: PluginOptions) => Plugin} */
const plugin = (opts = {}) => {
    /**
     * @typedef {{
     *     name: (string),
     *     url: (string),
     *     params: (Object),
     *     selectors: (Object),
     *     atRule: (AtRule),
     *     path: (string),
     *     parentPath: (string),
     *     svg: (string),
     *     error: (boolean)
     * }} Loader
     *
     * @typedef {Object.<string, Object.<string, Array<Loader>>>} LoaderHolder
     *
     * @type {LoaderHolder}
     */
    const loaders = {};

    /**
     * @typedef {{
     *     loader: (Loader),
     *     decl: (Declaration)
     * }} InlineLoader
     *
     * @type {Array<InlineLoader>}
     */
    const inlineLoaders = [];

    return {
        postcssPlugin: 'postcss-svg-inline',

        Once(root, { result }) {
            const atRules = root.nodes.filter(
                atRule =>
                    atRule.type === 'atrule' &&
                    atRule.name === 'svg-load'
            );

            for (const atRule of atRules) {
                const file = atRule?.source?.input?.file;
                const { name, url } = parseRuleDefinition(atRule.params);
                const { params, selectors } = getRuleParams(atRule);

                if (!loaders[file]) {
                    loaders[file] = {};
                }

                if (!loaders[file][name]) {
                    loaders[file][name] = [];
                }

                loaders[file][name].push({
                    name,
                    url,
                    params,
                    selectors,
                    atRule,
                    path: resolvePath(file, url, opts),
                    parentPath: file
                });
            }
        },

        AtRule: {
            'svg-load'(atRule) {
                atRule.remove();
            }
        },

        Declaration(decl, { result }) {
            if (decl.value.includes('svg-inline(')) {
                const loaderName = decl.value.match(/svg-inline\(([^)]+)\)/i)?.[1] || null;

                if (!loaderName) {
                    decl.warn(result, `Invalid svg-inline definition`);

                    return;
                }

                const loader = findLoader(decl, loaderName, loaders);

                if (!loader) {
                    decl.warn(result, `@svg-loader for "${loaderName}" is not defined`);

                    return;
                }

                inlineLoaders.push({
                    loader,
                    decl
                });
            }
        },

        OnceExit(root, { result }) {
            /** @type {(Loader) => Promise<void>} */
            const mapper = (loader) => {
                return load(loader.path, loader.params, loader.selectors, opts)
                    .then((code) => {
                        loader.svg = code;

                        result.messages.push({
                            type: 'dependency',
                            file: loader.path,
                            parent: loader.parentPath,
                        });
                    })
                    .catch((err) => {
                        loader.error = err;

                        loader.atRule.warn(result, err.message);
                    });
            }

            const usedLoaders = inlineLoaders
                .filter(x => !!x.loader)
                .map(x => x.loader);

            return Promise.all(usedLoaders.map(mapper)).then(() => {
                for (const inlineLoader of inlineLoaders) {
                    if (!inlineLoader.loader.error) {
                        const parsedValue = valueParser(inlineLoader.decl.value).walk((node) => {
                            if (node.type === 'function' && node.value === 'svg-inline') {
                                node.value = 'url';

                                node.nodes = [{
                                    type: 'word',
                                    value: inlineLoader.loader.svg,
                                }];
                            }
                        });

                        inlineLoader.decl.value = parsedValue.toString();
                    }
                }
            });
        },
    };
};

module.exports.postcss = true;

module.exports = plugin;
