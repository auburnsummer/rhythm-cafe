import preact from '@preact/preset-vite'
import analyze from 'rollup-plugin-analyzer'

// https://vitejs.dev/config/

/**
 * @type {import('vite').UserConfig}
 */
export default function config({ command, mode }) {

    /** @type {import('vite').UserConfig} */
    const developmentConfig = {
        plugins: [
            
        ]
    }

    /** @type {import('vite').UserConfig} */
    const productionConfig = {
        resolve: {
            alias: {
                "preact/debug": "./src/noop.js"
            }
        },
        plugins: [
            analyze()
        ]
    }

    const modeSpecificConfig = mode === 'development' ? developmentConfig : productionConfig;

    /** @type {import('vite').UserConfig} */
    const allConfig = {
        build: {
            cssCodeSplit: false
        },
        plugins: [
            preact(),
        ]
    }
    return {...modeSpecificConfig, ...allConfig, plugins: [...modeSpecificConfig.plugins, ...allConfig.plugins]}
}