/** @type {import('prettier').Config} */
module.exports = {
	importOrder: [
		"^(react/(.*)$)|^(react$)",
		"^(next/(.*)$)|^(next$)",
		"<THIRD_PARTY_MODULES>",
		"",
		"^types$",
		"^@/types/(.*)$",
		"^@/config/(.*)$",
		"^@/lib/(.*)$",
		"^@/hooks/(.*)$",
		"^@/components/ui/(.*)$",
		"^@/components/(.*)$",
		"^@/styles/(.*)$",
		"^@/app/(.*)$",
		"",
		"^[./]",
	],
	importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
	importOrderTypeScriptVersion: "5.1.0",
	jsxSingleQuote: true,
	overrides: [
		{
			files: ["*.cjs", "*.json", "*.mjs"],
			options: {
				singleQuote: false,
			},
		},
	],
	plugins: [
		"@ianvs/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	semi: false,
	singleQuote: true,
	trailingComma: "es5",
}
