import { Chart } from "chart.js/auto";

fetch("./total_events.json")
	.then((response) => response.json())
	.then((data) => {
		// options used to delay animation start
		let options = {
			rootMargin: "0px",
			threshold: 1.0,
		};
		// create observer
		let observer = new IntersectionObserver(callfunc, options);
		let target = document.getElementById("total-events");
		observer.observe(target);
		// callback function. when graph container visible, graph is then drawn
		function callfunc(entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// call function to create graph
					createEventsChart(data);
					observer.unobserve(target); // once drawn turn off observer
				}
			});
		}
	});

function createEventsChart(data) {
	// set colour for graph elements based on theme
	let drawColour = localStorage.theme === "dark" ? "#fdebf3" : "#1e1e2e";
	// set colour for bar fill based on theme
	let barColour = localStorage.theme === "dark" ? "#e6e6e6" : "#333333";
	// delayed variable governs animation; must be declared before Chart object
	let delayed;
	// create graph element
	const eventsChart = new Chart(document.getElementById("total-events"), {
		type: "bar",
		data: {
			datasets: [
				{
					data: [
						{
							y: data[0]["Event"],
							x: data[0]["Frequency"],
						},
						{
							y: data[1]["Event"],
							x: data[1]["Frequency"],
						},
						{
							y: data[2]["Event"],
							x: data[2]["Frequency"],
						},
						{
							y: data[3]["Event"],
							x: data[3]["Frequency"],
						},
					],
				},
			],
		},
		options: {
			indexAxis: "y",
			scales: {
				x: {
					ticks: {
						color: drawColour,
						//display: false,
					},
					grid: {
						drawOnChartArea: false,
						tickColor: drawColour,
					},
					border: {
						color: drawColour,
					},
				},
				y: {
					ticks: {
						color: drawColour,
					},
					grid: {
						drawOnChartArea: false,
						tickColor: drawColour,
					},
					border: {
						color: drawColour,
					},
				},
			},
			elements: {
				bar: {
					backgroundColor: barColour,
				},
			},
			animation: {
				duration: 5000,
				easing: "easeOutQuart",
				onComplete: () => {
					delayed = true;
				},
				delay: (context) => {
					let delay = 0;
					if (
						context.type === "data" &&
						context.mode === "default" &&
						!delayed
					) {
						delay =
							context.dataIndex * 1800 +
							context.datasetIndex * 100;
					}
					return delay;
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		},
	});
	// handle user theme changes
	function updateChartTheme() {
		// pick correct colour based off theme selected by user
		drawColour = localStorage.theme === "dark" ? "#fdebf3" : "#1e1e2e";
		barColour = localStorage.theme === "dark" ? "#fdebf3" : "#333333";
		// update events chart - some options need to be repeated to override defaults
		eventsChart.options = {
			indexAxis: "y",
			scales: {
				x: {
					ticks: {
						color: drawColour,
						//display: false,
					},
					grid: {
						drawOnChartArea: false,
						tickColor: drawColour,
					},
					border: {
						color: drawColour,
					},
				},
				y: {
					ticks: {
						color: drawColour,
					},
					grid: {
						drawOnChartArea: false,
						tickColor: drawColour,
					},
					border: {
						color: drawColour,
					},
				},
			},
			elements: {
				bar: {
					backgroundColor: barColour,
				},
			},
			animation: {
				duration: 5000,
				easing: "easeOutQuart",
				onComplete: () => {
					delayed = true;
				},
				delay: (context) => {
					let delay = 0;
					if (
						context.type === "data" &&
						context.mode === "default" &&
						!delayed
					) {
						delay =
							context.dataIndex * 300 +
							context.datasetIndex * 100;
					}
					return delay;
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
		};
		eventsChart.update();
	}
	document
		.getElementById("themeToggle")
		.addEventListener("click", updateChartTheme);
}
