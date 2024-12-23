/** @type {import('next').NextConfig} */
export default {
    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: "*.js",
                }
            }
        }
    }
};
