export const svg = {
  blurSVG: (base64: string) =>
    `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%">
			<defs>
				<filter id="blur-filter">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			<image href="data:image/avif;base64,${base64}" width="100%" height="100%" filter="url(#blur-filter)" />
		</svg>
	`,
}
