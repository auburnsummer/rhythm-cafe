// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
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
    // [
    //   '@snowpack/plugin-webpack',
    //   {
    //     extendConfig: (config) => {
    //       config.plugins.push(new BundleAnalyzerPlugin({generateStatsFile: true}));
    //       return config;
    //     }
    //   }
    // ]
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
