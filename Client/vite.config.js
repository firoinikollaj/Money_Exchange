import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:7121', // your backend API base
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
