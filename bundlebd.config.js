const { defineConfig } = require("bundlebd");
const fs = require("fs");
const { hash } = require("@intrnl/xxhash64");

const tsconfig = JSON.parse(
  fs.readFileSync('tsconfig.json', 'utf8')
);

const paths = tsconfig.compilerOptions?.paths ?? {};

const mapped = Object.fromEntries(
  Object.entries(paths).map(([path, values]) => [
    path,
    values[0]
  ])
);

const regex = /^[0-9]/;

module.exports = defineConfig({
	input: "src",
	output: "dist",
	importAliases: mapped,
  //generateCSSModuleScopedName: `[local]_[hash:6]`
  generateCSSModuleScopedName: (pluginName, name, path) => {
      let relativePath = path.replace(/\\/g,"/");
      relativePath = relativePath.replace(/.*\/src\//,'./');
      let fhash = hash(`${relativePath}`, 0).toString(16);
      fhash = `${/^\d/.test(fhash)?'_':''}${fhash}`.slice(0,6);
      let output = `${name}_${fhash}`;
      return output;
    },
});