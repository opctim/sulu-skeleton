const { readFile } = require('fs');
const { render } = require('./utils.js');
const { transform, encode, addXmlns } = require('./defaults.js');
const {
    removeFill,
    removeStroke,
    applyRootParams,
    applySelectedParams,
} = require('./processors.js');

function read(path) {
    return new Promise((resolve, reject) => {
        readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(Error(`Can't load '${path}'`));
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = function load(path, params, selectors, opts) {
    const processors = [
        removeFill(path, opts),
        removeStroke(path, opts),
        applyRootParams(params),
        applySelectedParams(selectors),
    ];

    return read(path).then((data) => {
        let code = render(data, ...processors);

        if (opts.xmlns !== false) {
            code = addXmlns(code);
        }

        if (opts.encode !== false) {
            code = (opts.encode || encode)(code);
        }

        if (opts.transform !== false) {
            code = (opts.transform || transform)(code, path);
        }

        return code;
    });
};
