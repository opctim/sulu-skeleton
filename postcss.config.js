module.exports = {
    plugins: [
        require('./assets/webpack/inline-svg')({
            paths: [
                './assets'
            ]
        }),
        require('autoprefixer'),
        require('postcss-svgo')({
            plugins: [{
                minifyStyles: false,
            }]
        }),
        require('postcss-base64'),
        require('postcss-merge-rules'),
        require('postcss-discard-duplicates'),
        require('postcss-merge-longhand'),
    ]
};
