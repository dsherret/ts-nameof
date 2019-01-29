import * as path from "path";

export const rootFolder = path.join(__dirname, "../");
export const packagePathMappings: { [packageName: string]: string; } = {
    "babel-plugin-ts-nameof": "packages/babel-plugin-ts-nameof",
    "ts-nameof": "packages/ts-nameof",
    "ts-nameof.macro": "packages/ts-nameof.macro",
    "common": "shared/common",
    "scripts-common": "shared/scripts-common",
    "tests-common": "shared/tests-common",
    "transforms-babel": "shared/transforms-babel",
    "transforms-common": "shared/transforms-common",
    "transforms-ts": "shared/transforms-ts"
};
export const allPackageNames = Object.keys(packagePathMappings);
export const allPackageDirPaths = allPackageNames.map(packageName => packagePathMappings[packageName]);
export const allPackageInfos = allPackageNames.map(packageName => ({ name: packageName, dirPath: packagePathMappings[packageName] }));
