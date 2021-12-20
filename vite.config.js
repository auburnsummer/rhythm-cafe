import preact from '@preact/preset-vite'
import analyze from 'rollup-plugin-analyzer'

// https://vitejs.dev/config/

/**
 * @type {import('vite').UserConfig}
 */
export default function config({ command, mode }) {

    const dev = mode === 'development';

    const aliases = {
        ...dev
            ? {

            }
            : {
                "preact/debug": "./src/noop.js"     
            },
        "react": "preact/compat",
        "react-dom": "preact/compat"
    }

    const plugins = [
        ...dev
            ? [

            ]
            : [
                analyze(),
            ],
        preact()
    ]

    const build = {
        cssCodeSplit: false
    }

    return {
        build,
        plugins,
        resolve: {
            alias: aliases
        }
    }
}