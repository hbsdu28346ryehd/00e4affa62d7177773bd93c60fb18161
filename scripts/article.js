const topElement = document.getElementById('top_content');
const bottomElement = document.getElementById('fireworks_animation');

window.addEventListener('scroll', () => {
	const topElementRect = topElement.getBoundingClientRect();

	if (topElementRect.bottom <= window.innerHeight) {
		bottomElement.style.display = 'block';
	}
});


function copyToClipboard(text) {
	var temp = document.createElement("input");
	document.body.appendChild(temp);
	temp.value = text;
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
	alert("Link copied to clipboard!");
}