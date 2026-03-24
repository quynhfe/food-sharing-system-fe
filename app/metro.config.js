const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const fs = require("fs");
const path = require("path");

const config = getDefaultConfig(__dirname);

let zustandRoot;
try {
  zustandRoot = path.dirname(
    require.resolve("zustand/package.json", { paths: [__dirname] }),
  );
} catch {
  zustandRoot = path.join(__dirname, "node_modules/zustand");
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force framer-motion to resolve to our mock
  if (moduleName === "framer-motion") {
    return {
      filePath: path.resolve(__dirname, "mocks/framer-motion.js"),
      type: "sourceFile",
    };
  }

  // Zustand's package "import" condition points to .mjs, which uses import.meta.env.
  // Metro's web bundle is a classic script (not type="module"), so the browser throws.
  // Force CommonJS builds for all platforms — same files React Native already uses.
  if (moduleName === "zustand") {
    return { filePath: path.join(zustandRoot, "index.js"), type: "sourceFile" };
  }
  if (moduleName === "zustand/middleware") {
    return { filePath: path.join(zustandRoot, "middleware.js"), type: "sourceFile" };
  }
  if (moduleName.startsWith("zustand/")) {
    const sub = moduleName.slice("zustand/".length);
    const candidate = path.join(zustandRoot, `${sub}.js`);
    if (fs.existsSync(candidate)) {
      return { filePath: candidate, type: "sourceFile" };
    }
  }

  // Chain to the default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
