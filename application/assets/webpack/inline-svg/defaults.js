const normalize = (code) => {
    return code
        .replace(/'/g, "%22")
        .replace(/"/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

module.exports = {
    encode(code) {
        return code
            .replace(/%/g, "%25")
            .replace(/</g, "%3C")
            .replace(/>/g, "%3E")
            .replace(/&/g, "%26")
            .replace(/#/g, "%23")
            .replace(/{/g, "%7B")
            .replace(/}/g, "%7D");
    },

    addXmlns(code) {
        if (code.indexOf("xmlns") === -1) {
            return code.replace(/<svg/g, '<svg xmlns="http://www.w3.org/2000/svg"');
        } else {
            return code;
        }
    },

    transform(code) {
        return `"data:image/svg+xml;charset=utf-8,${normalize(code)}"`;
    }
};
