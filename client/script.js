const video = document.getElementById('myVideo');
const ctx = document.getElementById('bufferChart').getContext('2d');
const newBufferedSizeDisplay = document.getElementById('newBufferedSize'); // Element to display buffered size

// Chart data structure
const bufferData = {
    labels: [], // Time labels
    datasets: [{
        label: 'New Buffered Size (seconds)',
        data: [], // Buffer sizes
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
    }]
};

// Initialize the chart
const bufferChart = new Chart(ctx, {
    type: 'line',
    data: bufferData,
    options: {
        responsive: true, // Make chart responsive
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (seconds)',
                },
                type: 'linear',
                position: 'bottom'
            },
            y: {
                title: {
                    display: true,
                    text: 'New Buffered Size (seconds)',
                },
                beginAtZero: true,
            },
        },
        elements: {
            line: {
                tension: 0 // Straight lines
            }
        }
    }
});

let previousBufferedDuration = 0; // Track previous buffered duration

// Function to update buffer size every second
const updateBufferSize = () => {
    const buffered = video.buffered;
    if (buffered.length > 0) {
        // Current buffered duration
        const currentBufferedDuration = buffered.end(buffered.length - 1) - buffered.start(0);

        // Calculate new buffered size
        const newBufferedSize = currentBufferedDuration - previousBufferedDuration;

        // Only record if there's new buffered data
        if (newBufferedSize > 0) {
            bufferData.labels.push(video.currentTime); // Push current playback time
            bufferData.datasets[0].data.push(newBufferedSize); // Push new buffered size

            // Update the previous buffered duration
            previousBufferedDuration = currentBufferedDuration;

            // Update the display of new buffered size
            newBufferedSizeDisplay.textContent = `New Buffered Size: ${newBufferedSize.toFixed(2)} seconds`; // Display in full seconds

            // Limit the number of data points to the last 1000
            if (bufferData.labels.length > 1000) {
                bufferData.labels.shift(); // Remove the oldest label
                bufferData.datasets[0].data.shift(); // Remove the oldest data point
            }

            // Update the chart
            bufferChart.update();
        }
    }
};

// Set interval to update the buffer size every second
setInterval(updateBufferSize, 1000); // Update every 1000 milliseconds (1 second)

// Additional event listener to ensure we start tracking the buffered data as soon as the video is ready
video.addEventListener('canplay', () => {
    updateBufferSize(); // Initial call to capture data right after the video can play
});
