/* ========================================
   Map Module - Interactive Australia Map
   ======================================== */

const GameMap = (function() {
    'use strict';

    let mapContainer = null;
    let markers = [];

    // Australia SVG path (simplified outline)
    const AUSTRALIA_SVG = `
        <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <!-- Ocean background -->
            <rect class="ocean" width="800" height="600" fill="var(--color-ocean)"/>

            <!-- Australia mainland -->
            <path class="land" d="
                M 180 200
                C 200 180, 250 160, 320 150
                C 380 145, 440 140, 500 145
                C 560 150, 620 160, 660 180
                C 700 200, 720 240, 730 280
                C 740 320, 735 360, 720 400
                C 700 450, 660 480, 600 500
                C 540 520, 480 530, 420 525
                C 360 520, 300 510, 250 490
                C 200 470, 160 440, 140 400
                C 120 360, 110 320, 120 280
                C 130 240, 150 210, 180 200
                Z
            "/>

            <!-- Tasmania -->
            <path class="land" d="
                M 580 520
                C 600 510, 630 515, 640 530
                C 650 545, 645 565, 630 575
                C 615 585, 590 580, 580 565
                C 570 550, 570 530, 580 520
                Z
            "/>

            <!-- Compass rose decoration -->
            <g class="compass" transform="translate(720, 80)">
                <circle cx="0" cy="0" r="25" fill="none" stroke="var(--color-ink)" stroke-width="2" opacity="0.5"/>
                <path d="M 0 -20 L 3 0 L 0 20 L -3 0 Z" fill="var(--color-ink)" opacity="0.5"/>
                <path d="M -20 0 L 0 3 L 20 0 L 0 -3 Z" fill="var(--color-ink)" opacity="0.5"/>
                <text x="0" y="-30" text-anchor="middle" font-size="10" fill="var(--color-ink)" opacity="0.5">N</text>
            </g>
        </svg>
    `;

    /**
     * Initialize the map
     * @param {string} containerId - ID of the map container element
     */
    function init(containerId) {
        mapContainer = document.getElementById(containerId);
        if (!mapContainer) {
            console.error('Map container not found:', containerId);
            return;
        }

        // Insert Australia SVG
        mapContainer.innerHTML = AUSTRALIA_SVG;
        console.log('Map initialized');
    }

    /**
     * Place animal markers on the map
     * @param {Array} animals - Array of animal objects
     * @param {Function} onClick - Click handler for markers
     */
    function placeMarkers(animals, onClick) {
        // Clear existing markers
        markers.forEach(marker => marker.remove());
        markers = [];

        animals.forEach(animal => {
            const marker = createMarker(animal, onClick);
            mapContainer.appendChild(marker);
            markers.push(marker);
        });

        console.log(`Placed ${markers.length} markers`);
    }

    /**
     * Create a marker element for an animal
     * @param {Object} animal - Animal data object
     * @param {Function} onClick - Click handler
     * @returns {HTMLElement} Marker element
     */
    function createMarker(animal, onClick) {
        const marker = document.createElement('button');
        marker.className = `marker marker--${animal.rarity}`;
        marker.dataset.animalId = animal.id;
        marker.setAttribute('aria-label', `Discover ${animal.name}`);

        // Position based on animal's coordinates (percentage-based)
        marker.style.left = `${animal.position.x}%`;
        marker.style.top = `${animal.position.y}%`;

        // Marker icon (emoji based on type)
        const icon = document.createElement('span');
        icon.className = 'marker__icon';
        icon.textContent = getAnimalEmoji(animal);
        marker.appendChild(icon);

        // G/K sound badge for speech practice animals
        if (animal.speechPractice && animal.speechPractice.hasGKSound) {
            const badge = document.createElement('span');
            badge.className = 'marker__speech-badge';
            badge.textContent = animal.speechPractice.targetSound.toUpperCase();
            badge.title = 'Practice this sound!';
            marker.appendChild(badge);
        }

        // Click handler
        marker.addEventListener('click', () => {
            marker.classList.add('marker--active');
            setTimeout(() => marker.classList.remove('marker--active'), 500);
            if (onClick) onClick(animal);
        });

        return marker;
    }

    /**
     * Get appropriate emoji for animal type
     * @param {Object} animal - Animal object
     * @returns {string} Emoji character
     */
    function getAnimalEmoji(animal) {
        const emojiMap = {
            // Deadly animals
            'crocodile': '🐊',
            'shark': '🦈',
            'snake': '🐍',
            'spider': '🕷️',
            'jellyfish': '🎐',
            'octopus': '🐙',
            'kangaroo': '🦘',
            'cassowary': '🦅',
            'platypus': '🦫',
            'dingo': '🐕',
            // Dinosaurs (use generic dino emoji or similar)
            'default_dino': '🦖',
            'flying': '🦅',
            'marine': '🐋'
        };

        // Try to match by animal type/name
        const name = animal.name.toLowerCase();
        for (const [key, emoji] of Object.entries(emojiMap)) {
            if (name.includes(key)) return emoji;
        }

        // Default based on category
        if (animal.category === 'dinosaur') {
            return animal.habitat === 'sea' ? '🐋' : '🦖';
        }

        return animal.habitat === 'sea' ? '🐠' : '🦎';
    }

    /**
     * Update marker state (collected/undiscovered)
     * @param {string} animalId - Animal ID
     * @param {boolean} collected - Whether the animal is collected
     */
    function updateMarkerState(animalId, collected) {
        const marker = markers.find(m => m.dataset.animalId === animalId);
        if (marker) {
            marker.classList.toggle('marker--collected', collected);
            marker.classList.toggle('marker--undiscovered', !collected);
        }
    }

    /**
     * Update all marker states based on collection
     * @param {Array} collectedIds - Array of collected animal IDs
     */
    function updateAllMarkerStates(collectedIds) {
        markers.forEach(marker => {
            const isCollected = collectedIds.includes(marker.dataset.animalId);
            marker.classList.toggle('marker--collected', isCollected);
        });
    }

    // Public API
    return {
        init,
        placeMarkers,
        updateMarkerState,
        updateAllMarkerStates
    };
})();
