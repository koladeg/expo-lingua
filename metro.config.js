const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const fs = require("fs");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const reactNativeRoot = path.resolve(__dirname, "node_modules/react-native");
const safeAreaContextPath = path.resolve(
  __dirname,
  "node_modules/react-native-safe-area-context/src/index.tsx"
);

config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-safe-area-context": path.dirname(safeAreaContextPath),
};

const nativewindConfig = withNativewind(config);
const nativewindResolveRequest = nativewindConfig.resolver.resolveRequest;

const resolverExtensions = [
  "ios.js",
  "native.js",
  "js",
  "jsx",
  "ios.ts",
  "native.ts",
  "ts",
  "ios.tsx",
  "native.tsx",
  "tsx",
  "json",
];

function resolveExistingFile(basePath) {
  for (const extension of resolverExtensions) {
    const filePath = `${basePath}.${extension}`;

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  for (const extension of resolverExtensions) {
    const filePath = path.join(basePath, `index.${extension}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function resolveReactNativeInternal(context, moduleName) {
  const originModulePath = context.originModulePath;

  if (
    !originModulePath ||
    !originModulePath.startsWith(`${reactNativeRoot}${path.sep}`) ||
    !moduleName.startsWith(".")
  ) {
    return null;
  }

  const filePath = resolveExistingFile(
    path.resolve(path.dirname(originModulePath), moduleName)
  );

  if (!filePath) {
    return null;
  }

  return {
    type: "sourceFile",
    filePath,
  };
}

nativewindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-safe-area-context") {
    return {
      type: "sourceFile",
      filePath: safeAreaContextPath,
    };
  }

  const reactNativeInternalModule = resolveReactNativeInternal(
    context,
    moduleName
  );

  if (reactNativeInternalModule) {
    return reactNativeInternalModule;
  }

  return nativewindResolveRequest(context, moduleName, platform);
};

module.exports = nativewindConfig;
