import { Chart } from "chart.js/auto";

fetch("./nappy_changes.json")
    .then((response) => response.text())
    .then((responseText) => {
        const data = JSON.parse(responseText, function (key, value) {
            if (key == "Date") {
                let dateString = new Date(Date.parse(value));
                const month = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                let dayString = dateString.getDate();
                let monthString = month[dateString.getMonth()];
                let yearString = dateString.getFullYear();
                return `${dayString} ${monthString} ${yearString}`;
            }
            return value;
        });
        return data;
    })
    // use my event listener set up below
    .then((data) => {
        // options used to delay animation start
        let options = {
            rootMargin: "0px",
            threshold: 1.0,
        };
        // create observer
        let observer = new IntersectionObserver(callfunc, options);
        let target = document.getElementById("nappy-changes");
        observer.observe(target);
        // callback function. when graph container visible, graph is then drawn
        function callfunc(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // call function to create graph
                    createNappyChart(data);
                    observer.unobserve(target); // once drawn turn off observer
                }
            });
        }
        // append total nappy changes to heading after line graph animation completes
        setTimeout(() => {
            const totalNappies = data[data.length - 1]["Count"];
            let heading = document.getElementById("nappy-changes-heading");
            heading.textContent = `Total Nappy Changes: ${totalNappies.toLocaleString()}!`;
        }, 10001); // wait until initial animation is complete
    });

function createNappyChart(data) {
    // axis, ticks, text colours based on theme button
    let drawColour = localStorage.theme === "dark" ? "#fdebf3" : "#1e1e2e";
    // length of animation
    const totalDuration = 10000;
    // calculate position and timing for plotting each point
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) =>
        ctx.index === 0
            ? ctx.chart.scales.y.getPixelForValue(100)
            : ctx.chart
                  .getDatasetMeta(ctx.datasetIndex)
                  .data[ctx.index - 1].getProps(["y"], true).y;
    // animation config block
    const animation = {
        x: {
            type: "number",
            easing: "linear",
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== "data" || ctx.xStarted) {
                    return 500;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            },
        },
        y: {
            type: "number",
            easing: "linear",
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== "data" || ctx.yStarted) {
                    return 500;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            },
        },
    };
    // create gradient colour for line plot
    let width, height, gradient;
    function getGradient(ctx, chartArea) {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
            // Create the gradient as first render
            // or the size has changed
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(
                0,
                chartArea.bottom,
                0,
                chartArea.top,
            );
            gradient.addColorStop(0, "blue");
            gradient.addColorStop(1, "red");
        }
        return gradient;
    }
    /*
    create chart
    */
    const nappyChart = new Chart(document.getElementById("nappy-changes"), {
        type: "line",
        data: {
            labels: data.map((row) => row.Date),
            datasets: [
                {
                    data: data.map((row) => row.Count),
                },
            ],
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 14,
                        color: drawColour,
                        callback: function (val, index) {
                            let xLabelValue = this.getLabelForValue(val);
                            let daySlice = this.getLabelForValue(val).slice(
                                0,
                                2,
                            );
                            return daySlice === "1 "
                                ? this.getLabelForValue(val)
                                : undefined;
                        },
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
                    title: {
                        display: true,
                        text: "Number of nappy changes",
                        color: drawColour,
                    },
                },
            },
            elements: {
                point: {
                    radius: 0,
                    backgroundColor: function (context) {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) {
                            // For initial chart load
                            return;
                        }
                        return getGradient(ctx, chartArea);
                    },
                },
                line: {
                    borderWidth: 1.5,
                    borderColor: drawColour,
                    backgroundColor: drawColour,
                    tension: 2,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            animation,
        },
    });
    // handle user theme changes
    function updateChartTheme() {
        // pick correct colour based off theme selected by user
        drawColour = localStorage.theme === "dark" ? "#fdebf3" : "#1e1e2e";
        // update nappy chart - some options need to be repeated to override defaults
        nappyChart.options = {
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 14,
                        color: drawColour,
                        callback: function (val, index) {
                            let xLabelValue = this.getLabelForValue(val);
                            let daySlice = this.getLabelForValue(val).slice(
                                0,
                                2,
                            );
                            return daySlice === "1 "
                                ? this.getLabelForValue(val)
                                : undefined;
                        },
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
                    title: {
                        display: true,
                        text: "Number of nappy changes",
                        color: drawColour,
                    },
                },
            },
            elements: {
                point: {
                    radius: 0,
                    backgroundColor: function (context) {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) {
                            // For initial chart load
                            return;
                        }
                        return getGradient(ctx, chartArea);
                    },
                },
                line: {
                    borderWidth: 1.5,
                    borderColor: drawColour,
                    backgroundColor: drawColour,
                    tension: 2,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        };
        // update the chart
        nappyChart.update();
    }
    // add listener to themeToggle button to trigger response to them change
    document
        .getElementById("themeToggle")
        .addEventListener("click", updateChartTheme);
}
