/* FUNCTIONS WHICH START AT THE BEGINNING OF THE CODE TO FORM HTML, SET RIGHT STYLES AND ETC.*/
fullscreen(); // setting a height to some tabs which has to be fullscreen

/* Event listeners */

// when window changes it size, so I change height of fullsceen elements
window.addEventListener('resize', fullscreen);

/*** Events Functions ***/

// A function which sets a fullscreen heigh to block(which has class .fullscreen)
function fullscreen() {
	// Getting .fullscreen elems
	let fullscreenTabs = document.querySelectorAll(".js-fullscreen");
	// Setting them a css style height, where the value is current window height
	fullscreenTabs.forEach(function(element) {
		element.style.height = window.innerHeight+"px";
	});
}

/*** Helpers ***/

// Finding particular parent by its className and its child
function findParentByClassName(childElement, parentClassName) {
	// If child element IS element that should be found
	if (childElement.classList.contains(parentClassName)) return false;

	let parentResult = childElement.parentNode; // Getting first parent of child
	// Starting loop
	// If element doesnt contain needed className so loop next
	while (!parentResult.classList.contains(parentClassName)) {
		// If body is our parent so its something wrong here, = nothing found
		if (parentResult.tagName === "BODY") return false;
		// Getting next parent element
		parentResult = parentResult.parentNode;
	}
	return parentResult;
}