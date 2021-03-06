export function pannable(node) {
	let x;
	let y;

	function handleMousedown(event) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panstart', {
			detail: { x, y }
		}));

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
		window.addEventListener('touchmove', handleMousemove);
		window.addEventListener('touchend', handleMouseup);
	}

	function handleMousemove(event) {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;
		node.dispatchEvent(new CustomEvent('panmove', {
			detail: {
				x, y, dx, dy,
				button: event.buttons
			}
		}));
	}

	function handleMouseup(event) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panend', {
			detail: { x, y }
		}));

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
		window.removeEventListener('touchmove', handleMousemove);
		window.removeEventListener('touchend', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);
	node.addEventListener('touchstart', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
			node.removeEventListener('touchstart', handleMousedown);
		}
	};
}