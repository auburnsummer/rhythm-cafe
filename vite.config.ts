import preact from '@preact/preset-vite'
import analyze from 'rollup-plugin-analyzer'
import * as path from 'path'


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
            ],
        preact()
    ]

    const build = {
        cssCodeSplit: false
    };

    const server: UserConfig['server'] = 
        'GITPOD_WORKSPACE_ID' in process.env
            ? {
                port: 3000,
                hmr: {
                    clientPort: 443
                }
            } : {
                port: 3001
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
