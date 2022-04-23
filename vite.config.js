import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import process from 'process'


// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  // process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const isDev = (mode === 'development')

  return defineConfig({
    // To access env vars here use process.env.TEST_VAR
    plugins: [vue()],
    base: isDev ? '/' : '/KlondikeSolitaire/',
    // publicDir: '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/css/_variables.scss";`
        }
      }
    },
  })
}

