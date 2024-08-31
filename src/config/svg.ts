export const svg = {
  blurSVG: (base64: string) => `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 8 5'>
			<filter id='b' color-interpolation-filters='sRGB'>
				<feGaussianBlur stdDeviation='1' />
			</filter>

			<image 
				preserveAspectRatio='none' 
				filter='url(#b)' 
				x='0' 
				y='0' 
				height='100%' 
				width='100%' 
				href='data:image/avif;base64,${base64}' 
			/>
		</svg>
	`,
}
