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

const shareBtn = document.getElementById('shareBtn')

shareBtn.addEventListener('click', event => {
	// Check for Web Share api support
	if (navigator.share) {
		const shareText = document.querySelector("input[name='article-share-text']").value;
		const shareUrl = document.querySelector("input[name='article-share-url']").value;
		// Browser supports native share api
		navigator.share({
			text: shareText,
			url: shareUrl
		}).then(() => {
			console.log('Thanks for sharing!');
		})
			.catch((err) => console.error(err));
	} else {
		// Fallback
		alert("The current browser does not support the share function. Please, manually share the link")
	}
});