const { selectOne, selectAll } = require('css-select');

function matchId(exp, id) {
    return exp instanceof RegExp ? exp.test(id) : Boolean(exp);
}

function removeFillAttrib(element) {
    delete element.attribs.fill;
}

function removeStrokeAttrib(element) {
    delete element.attribs.stroke;
}

function applyParams(params) {
    return ({attribs}) => {
        Object.keys(params).forEach((name) => {
            attribs[name] = params[name];
        });
    };
}

module.exports = {
    removeFill(id, opts) {
        return (dom) => {
            if (matchId(opts.removeFill, id)) {
                selectAll('[fill]', dom).forEach(removeFillAttrib);
            }
        };
    },

    removeStroke(id, opts) {
        return (dom) => {
            if (matchId(opts.removeStroke, id)) {
                selectAll('[stroke]', dom).forEach(removeStrokeAttrib);
            }
        };
    },

    applyRootParams(params) {
        return (dom) => {
            applyParams(params)(selectOne('svg', dom));
        };
    },

    applySelectedParams(selectors) {
        return (dom) => {
            const svg = selectOne('svg', dom);

            Object.keys(selectors).forEach((selector) => {
                selectAll(selector, svg).forEach(applyParams(selectors[selector]));
            });
        };
    }
};
