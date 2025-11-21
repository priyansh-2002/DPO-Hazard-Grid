document.addEventListener('DOMContentLoaded', () => {
            
    // --- Logic 1: Data Collection Chart (Chart.js) ---
    // Helper check to ensure canvas exists before running chart logic
    const chartElement = document.getElementById('dataChart');
    if (chartElement) {
        const dataChartCtx = chartElement.getContext('2d');
        new Chart(dataChartCtx, {
            type: 'bar',
            data: {
                labels: ['Preferred Steps (Win)', 'Rejected Steps (Loss)'],
                datasets: [{
                    label: 'Number of Steps',
                    data: [52, 23],
                    backgroundColor: [
                        'rgba(13, 148, 136, 0.6)', // teal-600
                        'rgba(239, 68, 68, 0.6)'  // red-500
                    ],
                    borderColor: [
                        'rgba(13, 148, 136, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Human Preference Dataset'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sample Count'
                        }
                    }
                }
            }
        });
    }

    // --- Logic 2: Agent Grid Animation ---
    const gridContainer = document.getElementById('agent-grid-container');
    const playButton = document.getElementById('play-animation-btn');
    const statusText = document.getElementById('agent-status');
    
    if (gridContainer && playButton && statusText) {
        const gridSize = 5;
        const lava = [[1, 1], [1, 2], [2, 2]];
        const start = [0, 0];
        const goal = [4, 4];
        
        // Trajectory Data based on project logs
        const agentPathCorrected = [
            [0, 0], // Start
            [0, 1], // Right
            [0, 2], // Right
            [0, 3], // Right
            [1, 3], // Down
            [2, 3], // Down
            [3, 3], // Down
            [4, 3], // Down
            [4, 4]  // Right
        ];

        let animationInterval;
        let currentStep = 0;

        // Function to render the grid state
        function drawGrid(agentPos = null) {
            gridContainer.innerHTML = '';
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const cell = document.createElement('div');
                    cell.classList.add('grid-cell');
                    
                    if (r === start[0] && c === start[1]) {
                        cell.classList.add('grid-cell-start');
                        cell.textContent = 'S';
                    }
                    if (r === goal[0] && c === goal[1]) {
                        cell.classList.add('grid-cell-goal');
                        cell.textContent = 'G';
                    }
                    if (lava.some(l => l[0] === r && l[1] === c)) {
                        cell.classList.add('grid-cell-lava');
                        cell.textContent = 'X';
                    }
                    if (agentPos && r === agentPos[0] && c === agentPos[1]) {
                        cell.classList.add('grid-cell-agent');
                        cell.textContent = 'A';
                    }
                    gridContainer.appendChild(cell);
                }
            }
        }
        
        function stopAnimation() {
            clearInterval(animationInterval);
            playButton.disabled = false;
            playButton.textContent = 'Play Agent Run';
        }

        playButton.addEventListener('click', () => {
            stopAnimation();
            currentStep = 0;
            playButton.disabled = true;
            playButton.textContent = 'Running...';
            statusText.textContent = '';
            
            animationInterval = setInterval(() => {
                if (currentStep >= agentPathCorrected.length) {
                    stopAnimation();
                    statusText.textContent = 'GAME OVER: won';
                    return;
                }
                
                const pos = agentPathCorrected[currentStep];
                drawGrid(pos);
                
                if (currentStep > 0) {
                    const prevPos = agentPathCorrected[currentStep - 1];
                    let move = '';
                    if (pos[0] > prevPos[0]) move = 'Down';
                    else if (pos[0] < prevPos[0]) move = 'Up';
                    else if (pos[1] > prevPos[1]) move = 'Right';
                    else if (pos[1] < prevPos[1]) move = 'Left';
                    statusText.textContent = `Agent moved: ${move}`;
                }
                
                currentStep++;
            }, 700);
        });
        
        drawGrid(start); // Initial draw
    }

    // --- 3. Init ScrollSpy for Nav ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
    
    // --- 4. Init Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});