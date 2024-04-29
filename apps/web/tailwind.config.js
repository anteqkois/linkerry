// const { fontFamily } = require('tailwindcss/defaultTheme')
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind')
const { join } = require('path')
/** @type {import('tailwindcss').Config} */

const newSizes = {
	100: '25rem' /* 400px */,
	108: '27rem' /* 432px */,
	112: '28rem' /* 448px */,
	120: '30rem' /* 480px */,
	128: '32rem' /* 512px */,
	144: '36rem' /* 576px */,
	160: '40rem' /* 640px */,
	176: '44rem' /* 704px */,
	192: '48rem' /* 768px */,
	208: '52rem' /* 832px */,
	224: '56rem' /* 896px */,
	240: '60rem' /* 960px */,
	256: '64rem' /* 1024px */,
	288: '72rem' /* 1152px */,
	320: '80rem' /* 1280px */,
	384: '96rem' /* 1536px */,
	448: '112rem' /* 1792px */,
	512: '128rem' /* 2048px */,
}

module.exports = {
	important: true,
	darkMode: ['class'],
	content: [
		// './pages/**/*.{ts,tsx}',
		// './components/**/*.{ts,tsx}',
		// './app/**/*.{ts,tsx}',
		// './src/**/*.{ts,tsx}',
		join(__dirname, '{src,pages,components,app,modules,shared}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
		...createGlobPatternsForDependencies(__dirname),
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				// background: 'hsl(var(--background))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					page: 'hsl(var(--background-page))',
				},
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground))',
					text: 'hsl(var(--primary-text) / <alpha-value>)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				positive: {
					DEFAULT: 'hsl(var(--positive))',
					foreground: 'hsl(var(--positive-foreground))',
				},
				negative: {
					DEFAULT: 'hsl(var(--negative))',
					foreground: 'hsl(var(--negative-foreground))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
			},
			space: {
				...newSizes,
			},
			width: {
				...newSizes,
			},
			maxWidth: {
				dialog: 'var(--max-w-dialog)',
			},
			maxHeight: {
				'screen-no-nav': 'calc(100vh - 64px)',
			},
			minHeight: {
				'screen-no-nav': 'calc(100vh - 64px)',
			},
			height: newSizes,
			translate: newSizes,
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				// sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
	safelist: ['border-destructive', 'bg-destructive', 'text-destructive-foreground', 'border-secondary', 'bg-secondary', 'text-secondary-foreground'],
}
