import type { KnipConfig } from 'knip'

const config: KnipConfig = {
	next: {
		entry: ['next.config.{js,ts,cjs,mjs}', 'src/{app}/**/*.{ts,tsx}'],
	},
}

export default config
