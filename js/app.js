/* ========================================
   App Module - Main Application Controller
   ======================================== */

const App = (function() {
    'use strict';

    /**
     * Initialize the application
     */
    async function init() {
        console.log('🦘 Australian Animal Adventure starting...');

        try {
            // Initialize modules
            Speech.init();
            Cards.init();
            Collection.init();
            GameMap.init('australia-map');

            // Load animal data
            const animals = await AnimalData.loadAnimals();

            if (animals.length === 0) {
                showError('Could not load animal data. Please try refreshing the page.');
                return;
            }

            // Place markers on map
            GameMap.placeMarkers(animals, handleAnimalClick);

            // Update marker states based on collection
            GameMap.updateAllMarkerStates(Collection.getCollectedIds());

            // Setup collect button handler
            setupCollectHandler();

            // Setup filter button handlers
            setupFilterHandlers();

            console.log('🎉 App initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
            showError('Something went wrong. Please try refreshing the page.');
        }
    }

    /**
     * Handle click on animal marker
     * @param {Object} animal - Animal data object
     */
    function handleAnimalClick(animal) {
        const isCollected = Collection.isCollected(animal.id);
        Cards.show(animal, isCollected);
    }

    /**
     * Setup collect button event handler
     */
    function setupCollectHandler() {
        const collectBtn = document.getElementById('btn-collect');
        if (!collectBtn) return;

        collectBtn.addEventListener('click', () => {
            const animal = Cards.getCurrentAnimal();
            if (!animal) return;

            const isNew = Collection.collect(animal.id);

            if (isNew) {
                // Update UI
                Cards.setCollected(true);
                GameMap.updateMarkerState(animal.id, true);
            }
        });
    }

    /**
     * Setup filter button event handlers
     */
    function setupFilterHandlers() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (!filterButtons.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
                button.classList.add('filter-btn--active');

                // Filter markers
                const filter = button.dataset.filter;
                GameMap.filterMarkers(filter);
            });
        });
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    function showError(message) {
        const main = document.querySelector('.main');
        if (main) {
            main.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem;">
                    <p style="font-size: 3rem;">😢</p>
                    <p style="font-size: 1.25rem; color: var(--color-danger);">${message}</p>
                </div>
            `;
        }
    }

    // Public API
    return {
        init
    };
})();

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
