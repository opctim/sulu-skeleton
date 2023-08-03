const { dirname, resolve } = require('path');
const { existsSync } = require('fs');
const valueParser = require('postcss-value-parser');
const { parseDocument } = require('htmlparser2');
const { default: serialize } = require('dom-serializer');

module.exports = {
    resolvePath(file, url, opts) {
        if (opts.paths && opts.paths.length) {
            let absolutePath;

            for (let path of opts.paths) {
                absolutePath = resolve(path, url);

                if (existsSync(absolutePath)) {
                    return absolutePath;
                }
            }

            return absolutePath;
        }

        if (file) {
            return resolve(dirname(file), url);
        }

        return resolve(url);
    },

    parseRuleDefinition(params) {
        const { nodes } = valueParser(params);

        if (
            nodes.length !== 3 ||
            nodes[0].type !== 'word' ||
            nodes[1].type !== 'space' ||
            nodes[2].type !== 'function' ||
            nodes[2].value !== 'url' ||
            nodes[2].nodes.length === 0
        ) {
            throw Error(`Invalid '@svg-load' declaration`);
        }

        return {
            name: nodes[0].value,
            url: nodes[2].nodes[0].value,
        }
    },

    getRuleParams(rule) {
        const params = {};
        const selectors = {};

        for (const node of rule.nodes) {
            if (node.type === 'decl') {
                params[node.prop] = node.value;
            } else if (node.type === 'rule') {
                const selector = selectors[node.selectors] || {};

                for (const child of node.nodes) {
                    if (child.type === 'decl') {
                        selector[child.prop] = child.value;
                    }
                }

                selectors[node.selectors] = selector;
            }
        }

        return {
            params,
            selectors
        };
    },

    render(code, ...processors) {
        const dom = parseDocument(code, { xmlMode: true });

        processors.forEach((processor) => processor(dom));

        return serialize(dom);
    },

    /**
     * @param node {import('postcss').Node}
     * @param name {string}
     * @param loaderHolder {LoaderHolder}
     *
     * @return {Loader|null}
     */
    findLoader(node, name, loaderHolder) {
        /** @type {Array<Loader>|null} */
        const loaders = loaderHolder?.[node.source.input.file]?.[name] || null;

        if (!loaders) {
            return null;
        }

        const descending = loaders.sort((a, b) => {
            return b.atRule.source.end.offset - a.atRule.source.end.offset;
        });

        for (const loader of descending) {
            if (node.source.end.offset > loader.atRule.source.end.offset) {
                return loader;
            }
        }

        return null;
    }
};
