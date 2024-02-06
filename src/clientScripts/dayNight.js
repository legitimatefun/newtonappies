import { Chart } from "chart.js/auto";

fetch("./day_night.json")
	.then((response) => response.json())
	.then((data) => {
		createDayNightChart(data);
	});

function createDayNightChart(data) {
	// define chart area
	const ctx = document.getElementById("day-night");
	// set color for graph elements based on theme
	let drawColour = localStorage.theme === "dark" ? "#fdebf3" : "#1e1e2e";
	let graphTitle = "Daily Average: First 5 Months";
	let graphOptions = {
		scales: {
			r: {
				ticks: {
					backdropColor: "#00000000", // transparent
					color: drawColour,
				},
				grid: {
					color: "#666666", // dark gray
				},
				pointLabels: {
					display: true,
					centerPointLabels: true,
					font: {
						size: 14,
					},
					color: drawColour,
				},
			},
		},
		plugins: {
			title: {
				display: true,
				text: graphTitle,
				color: drawColour,
				font: {
					size: 20,
				},
			},
			legend: {
				labels: {
					color: drawColour,
					font: {
						size: 14,
					},
				},
			},
			tooltip: {
				displayColors: true,
				boxPadding: 2,
				callbacks: {
					label: function (context) {
						let rParsed = context.parsed.r
						let label = `${rParsed.toFixed(3)}`;
						return label;
					},
				},
			},
		},
	};
	const configFirstFiveMonths = {
		type: "polarArea",
		data: {
			labels: Object.keys(data[0]).slice(1, 4), // gets relevant keys from data
			datasets: [
				{
					label: data[0]["index"],
					data: Object.values(data[0]).slice(1, 4), // get relevant values from data
				},
			],
		},
		options: graphOptions,
	};
	const configSixMonths = {
		type: "polarArea",
		data: {
			labels: Object.keys(data[1]).slice(1, 4), // gets relevant keys from data
			datasets: [
				{
					label: data[1]["index"],
					data: Object.values(data[1]).slice(1, 4), // get relevant values from data
				},
			],
		},
		options: graphOptions,
	};
	// create graph
	let dayNightChart = new Chart(ctx, configFirstFiveMonths);
	// handle user theme changes
	function updateChartTheme() {
		drawColour = localStorage.theme === "dark" ? "#fdebf3" : "#1e1e2e";
		// update chart with new colours - some options are repeated to override defaults
		dayNightChart.options = {
			scales: {
				r: {
					ticks: {
						backdropColor: "#00000000", // transparent
						color: drawColour,
					},
					grid: {
						color: "#666666", // dark gray
					},
					pointLabels: {
						display: true,
						centerPointLabels: true,
						font: {
							size: 14,
						},
						color: drawColour,
					},
				},
			},
			plugins: {
				title: {
					display: true,
					text: graphTitle,
					color: drawColour,
					font: {
						size: 20,
					},
				},
				legend: {
					labels: {
						color: drawColour,
						font: {
							size: 14,
						},
					},
				},
			},
		};
		dayNightChart.update();
	}
	// handle user event to change theme
	document
		.getElementById("themeToggle")
		.addEventListener("click", updateChartTheme);
	// Update chart for data based on user selection
	const updateData = () => {
		// get current data metadata and get label
		let chartMeta = dayNightChart.getSortedVisibleDatasetMetas(0);
		let chartDataLabel = chartMeta[0].label;
		// set new graph title
		let graphTitle =
			chartDataLabel === "firstFiveMonths"
				? "Daily Average: 6 to 12 Months"
				: "Daily Average: First 5 Months";
		let useData =
			chartDataLabel === "firstFiveMonths"
				? configSixMonths
				: configFirstFiveMonths;
		// destroy old chart and redraw with new data
		dayNightChart.destroy();
		dayNightChart = new Chart(ctx, useData);
		dayNightChart.options = {
			scales: {
				r: {
					ticks: {
						backdropColor: "#00000000", // transparent
						color: drawColour,
					},
					grid: {
						color: "#666666", // dark gray
					},
					pointLabels: {
						display: true,
						centerPointLabels: true,
						font: {
							size: 14,
						},
						color: drawColour,
					},
				},
			},
			plugins: {
				title: {
					display: true,
					text: graphTitle,
					color: drawColour,
					font: {
						size: 20,
					},
				},
				legend: {
					labels: {
						color: drawColour,
						font: {
							size: 14,
						},
					},
				},
			},
		};
		dayNightChart.update();
	};
	document
		.getElementById("dayNightData")
		.addEventListener("click", updateData);
}
