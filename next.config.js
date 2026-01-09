/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    // Tempo platform configuration
    webpack: (config, { isServer }) => {
        if (!isServer && process.env.TEMPO === "true") {
            config.watchOptions = {
                ...config.watchOptions,
                ignored: ['**/node_modules', '**/.next', '**/tempobook'],
            };
        }
        return config;
    },
    // Allow Tempo platform to proxy requests
    async headers() {
        if (process.env.TEMPO === "true") {
            return [
                {
                    source: '/:path*',
                    headers: [
                        {
                            key: 'Access-Control-Allow-Origin',
                            value: '*',
                        },
                    ],
                },
            ];
        }
        return [];
    },
};

module.exports = nextConfig;
