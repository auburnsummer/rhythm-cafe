import preact from '@preact/preset-vite'
import analyze from 'rollup-plugin-analyzer'
import * as path from 'path'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/

import { defineConfig, UserConfig } from 'vite'

export default defineConfig(({command, mode}) => {
    const dev = mode === 'development';

    const aliases = {
        ...dev
            ? {

            }
            : {
                "preact/debug": path.resolve(__dirname, './src/utils/noop'),     
            },
        "react": "preact/compat",
        "react-dom": "preact/compat",
        "@orchard": path.resolve(__dirname, './src'),
    };

    const plugins = [
        ...dev
            ? [

            ]
            : [
                analyze(),
                visualizer()
            ],
        preact()
    ]

    const build = {
        cssCodeSplit: false
    };

    const server: UserConfig['server'] = 
        'CODESPACES' in process.env
            ? {
                port: 5173,
                hmr: {
                    clientPort: 443
                }
            } : {
                port: 5173
            };

    return {
        build,
        plugins,
        server,
        resolve: {
            alias: aliases
        }
    }
})
