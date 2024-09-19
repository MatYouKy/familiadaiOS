module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@__types': './types',
            '@__assets': './assets',
            '@__colors': './colors',
            '@__utils': './utils',
            '@__components': './components',
            '@__ui': './components/ui',
            '@__app': './components/app',
            '@__hooks': './hooks',
            '@__store': './store',
          },
        },
      ],
    ],
  };
};
