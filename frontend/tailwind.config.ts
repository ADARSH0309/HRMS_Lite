import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(222 47% 11%)', // Fixed dark navy for sidebar
					foreground: 'hsl(210 40% 98%)',
					primary: 'hsl(246 80% 60%)',
					'primary-foreground': 'hsl(0 0% 100%)',
					accent: 'hsl(217 33% 17%)',
					'accent-foreground': 'hsl(210 40% 98%)',
					border: 'hsl(217 33% 17%)',
					ring: 'hsl(224 76% 48%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(16px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					from: { opacity: '0', transform: 'translateX(-16px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
					'50%': { boxShadow: '0 0 20px 4px rgba(99, 102, 241, 0.15)' }
				},
				'row-slide-in': {
					from: { opacity: '0', transform: 'translateX(-12px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'flip-in': {
					from: { opacity: '0', transform: 'rotateX(90deg)' },
					to: { opacity: '1', transform: 'rotateX(0deg)' }
				},
				'badge-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
					'50%': { boxShadow: '0 0 12px 3px rgba(34, 197, 94, 0.2)' }
				},
				'float-glow': {
					'0%, 100%': { transform: 'translateY(0)', filter: 'drop-shadow(0 0 0 rgba(99,102,241,0))' },
					'50%': { transform: 'translateY(-6px)', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.25))' }
				},
				'border-shimmer': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out forwards',
				'shimmer': 'shimmer 1.5s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'row-slide-in': 'row-slide-in 0.35s ease-out forwards',
				'flip-in': 'flip-in 0.4s ease-out forwards',
				'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
				'float-glow': 'float-glow 3s ease-in-out infinite',
				'border-shimmer': 'border-shimmer 3s ease infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
