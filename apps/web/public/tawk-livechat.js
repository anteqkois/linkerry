var Tawk_API = Tawk_API || {},
	Tawk_LoadStart = new Date()
;(function () {
	Tawk_API.customStyle = {
		visibility : {
			desktop : {
				xOffset : 5,
				yOffset : 5,
				// position : 'br', 'bl', 'cr', 'cl', 'tr', 'tl' // Accepted value
			},
			mobile : {
				xOffset : 5,
				yOffset : 5,
				// position : 'br', 'bl', 'cr', 'cl', 'tr', 'tl' // Accepted value
			},
			// bubble : {
			// 	xOffset : 5,
			// 	yOffset : 5,
			// 	// rotate : 90, -90, 0 // Accepted value
			// }
		}
	};
	var s1 = document.createElement('script'),
		s0 = document.getElementsByTagName('script')[0]
	s1.async = true
	s1.src = 'https://embed.tawk.to/6628118b1ec1082f04e6041d/1hs68926p'
	s1.charset = 'UTF-8'
	s1.setAttribute('crossorigin', '*')
	s0.parentNode.insertBefore(s1, s0)
})()
