const topElement = document.getElementById('top_content');
const bottomElement = document.getElementById('fireworks_animation');

window.addEventListener('scroll', () => {
	const topElementRect = topElement.getBoundingClientRect();

	if (topElementRect.bottom <= window.innerHeight) {
		bottomElement.style.display = 'block';
	}
});