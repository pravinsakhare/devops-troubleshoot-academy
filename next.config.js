/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    experimental: {
        esmExternals: true,
    },
    // Tempo platform configuration
    webpack: (config, { isServer }) => {
        if (!isServer && process.env.TEMPO === "true") {
            config.watchOptions = {
                ...config.watchOptions,
                ignored: ['**/node_modules', '**/.next', '**/tempobook'],
            };
        }
        config.externals.push({
            "node-pty": "node-pty",
        });
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                xterm: false,
                'xterm-addon-fit': false,
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
