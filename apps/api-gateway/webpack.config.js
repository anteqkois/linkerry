const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx({}), (config) => {
  config.module?.rules.forEach((rule) => {
    if (rule.options?.transpileOnly) {
      rule.options.transpileOnly = false;
    }
  });

  config.devtool = 'inline-source-map';
  config.plugins = config.plugins?.filter(
    (plugin) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
  );
  return config;
});
