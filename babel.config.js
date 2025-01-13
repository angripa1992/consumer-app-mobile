module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			'nativewind/babel',
			'react-native-reanimated/plugin',
			'@babel/plugin-proposal-export-namespace-from',
			[
				'module-resolver',
				{
					alias: {
						'@/UI': './src/UI',
						'@/svg': './src/UI/assets/svg/',
						'@/images': './src/UI/assets/images/',
						'@/screens': './src/screens',
						'@/navigation': './src/navigation',
						'@/hooks': './src/lib/hooks',
						'@/utils': './src/lib/utils',
						'@/types': './src/lib/types',
						'@/helpers': './src/lib/helpers',
						'@/schemas': './src/lib/schemas',
						'@/lib': './src/lib',
						'@/store': './src/lib/store',
						'@/root': './',
					},
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			],
		],
	};
};
