// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    routes: [
        {match: 'routes', src: '.*', dest: '/index.html'},
    ],
    optimize: {
        bundle: true,
        minify: true,
        target: 'es2018',
    },
    exclude: [
        '**/node_modules/**/*',
    ],
    mount: {
        src: '/dist',
        public: '/',
    },
    plugins: [
        'snowpack-plugin-yaml',
        '@snowpack/plugin-typescript',
    ],
    packageOptions: {
    /* ... */
    },
    devOptions: {
    /* ... */
    },
    buildOptions: {
    /* ... */
    },
};
