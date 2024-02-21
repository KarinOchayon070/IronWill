let sideMenu = document.getElementById("sideMenu");
function openMenue() {
	sideMenu.style.right = "0";
}
function closeMenue() {
	sideMenu.style.right = "-200px";
}

// This is the code for the changing text in the home section

// Find all the words that has the "word" class - this are the words i'm gonna change the text all the time
let words = document.querySelectorAll(".word");

words.forEach(function (word) {
	// The text content will be divided into individual characters and stored as separate elements in an array
	let letters = word.textContent.split("");
	// Setting the text content of an HTML element to an empty string
	word.textContent = "";
	letters.forEach(function (letter) {
		let span = document.createElement("span");
		span.textContent = letter;
		span.className = "letter";
		word.append(span);
	});
});

let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";

let changeText = function () {
	let currentWord = words[currentWordIndex];
	let nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];

	Array.from(currentWord.children).forEach((letter, i) => {
		setTimeout(() => {
			letter.className = "letter out";
		}, i * 80);
	});

	nextWord.style.opacity = "1";
	Array.from(nextWord.children).forEach((letter, i) => {
		letter.className = "letter behind";
		setTimeout(() => {
			letter.className = "letter in";
		}, 340 + i * 80);
	});
	currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};
changeText();
setInterval(changeText, 4000);

// ============================================================================================================

// Transfer the data from the form to google sheet
const scriptURL =
	"https://script.google.com/macros/s/AKfycbyJ8RQUj7MhHQNC3-EIPVpjHJNq6qEUJRZq3WFq5bwikEinYENvhEH-790n6ONyTmgk/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	msg.innerHTML = "טוען...";
	fetch(scriptURL, {
		method: "POST",
		body: new FormData(form),
		mode: "cors",
	})
		.then((response) => response.text())
		.then((data) => {
			console.log("Response from Google Sheets:", data);
			triggerConfetti();
			msg.innerHTML = "תודה! ההודעה נשלחה בהצלחה, אחזור אלייך בהקדם";
			setTimeout(() => {
				msg.innerHTML = "";
			}, 5000);
			form.reset();
		})
		.catch((error) => {
			console.log({ error });
			msg.innerHTML = "אופסי, משהו השתבש וההודעה אינה נשלחה, אנא נסה שנית";
			setTimeout(() => {
				msg.innerHTML = "";
			}, 5000);
			form.reset();
		});
});

// ============================================================================================================

// Get the current year
let currentYear = new Date().getFullYear();

// Update the content of the span element with the current year
document.getElementById("currentYear").textContent = currentYear;

// ============================================================================================================

function triggerConfetti() {
	var canvas = document.getElementById("confetti-canvas");
	var ctx = canvas.getContext("2d");
	var emojis = ["🎉", "🎊", "✨", "💪🏼", "⭐"];
	var particles = [];

	// Add particles with random positions and lifespans
	for (var i = 0; i < 100; i++) {
		particles.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			size: Math.random() * 20 + 10,
			emoji: emojis[Math.floor(Math.random() * emojis.length)],
			velocityY: Math.random() * 0.2 + 0.2, // Adjust velocity for slower movement
			lifespan: Math.random() * 5000, // Set lifespan to 5 seconds
		});
	}

	// Update and draw particles
	function update() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach(function (particle, index) {
			particle.y += particle.velocityY;

			ctx.font = particle.size + "px Arial";
			ctx.fillText(particle.emoji, particle.x, particle.y);

			// Remove particles that exceed their lifespan
			particle.lifespan -= 1000 / 60; // 60 frames per second
			if (particle.lifespan <= 0) {
				particles.splice(index, 1);
			}
		});

		requestAnimationFrame(update);
	}
	update();
}
