import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            collections: {
                lmd: () => import('@iconify-json/line-md/icons.json').then((i) => i.default),
            },
            extraProperties: {
                display: 'block',
            },
        }),
    ],
})
