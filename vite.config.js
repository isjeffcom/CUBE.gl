import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CUBE',
      fileName: (format) => `cubegl.${format === 'umd' ? 'umd' : 'es'}.js`,
      formats: ['umd', 'es']
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: [
        {
          // UMD build: inline all dynamic imports to avoid code-splitting
          format: 'umd',
          name: 'CUBE',
          inlineDynamicImports: true,
          entryFileNames: 'cubegl.umd.js',
          globals: {
            three: 'THREE'
          }
        },
        {
          // ES build: allow code-splitting for tree-shaking
          format: 'es',
          entryFileNames: 'cubegl.es.js'
        }
      ]
    }
  },
  server: {
    port: 8081
  },
  publicDir: 'static'
})
