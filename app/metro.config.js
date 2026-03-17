const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force framer-motion to resolve to our mock
  if (moduleName === "framer-motion") {
    return {
      filePath: path.resolve(__dirname, "mocks/framer-motion.js"),
      type: "sourceFile",
    };
  }

  // Chain to the default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
