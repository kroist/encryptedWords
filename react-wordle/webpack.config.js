module.exports = {
    resolve: {
        fallback: {
            'tfhe_bg.wasm': require.resolve('tfhe/tfhe_bg.wasm'),
        },
    },
};
