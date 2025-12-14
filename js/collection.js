/* ========================================
   Collection Module - Progress Tracking
   ======================================== */

const Collection = (function() {
    'use strict';

    const STORAGE_KEY = 'animal_adventure_collection';
    let collection = new Set();
    let modal = null;
    let grid = null;

    /**
     * Initialize the collection module
     */
    function init() {
        modal = document.getElementById('collection-modal');
        grid = document.getElementById('collection-grid');

        // Load saved collection from localStorage
        loadFromStorage();

        // Setup toggle button
        const toggleBtn = document.getElementById('collection-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', showGallery);
        }

        // Setup close handlers for gallery modal
        if (modal) {
            modal.querySelectorAll('[data-close-modal]').forEach(el => {
                el.addEventListener('click', hideGallery);
            });
        }

        // Setup print buttons
        const printMapBtn = document.getElementById('btn-print-map');
        const printCardsBtn = document.getElementById('btn-print-cards');

        if (printMapBtn) {
            printMapBtn.addEventListener('click', () => printView('map'));
        }
        if (printCardsBtn) {
            printCardsBtn.addEventListener('click', () => printView('cards'));
        }

        // Update progress display
        updateProgressDisplay();

        console.log('Collection module initialized');
    }

    /**
     * Load collection from localStorage
     */
    function loadFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                collection = new Set(parsed);
            }
        } catch (error) {
            console.error('Error loading collection:', error);
            collection = new Set();
        }
    }

    /**
     * Save collection to localStorage
     */
    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...collection]));
        } catch (error) {
            console.error('Error saving collection:', error);
        }
    }

    /**
     * Add an animal to the collection
     * @param {string} animalId - Animal ID to collect
     * @returns {boolean} True if newly collected, false if already had
     */
    function collect(animalId) {
        if (collection.has(animalId)) {
            return false;
        }

        collection.add(animalId);
        saveToStorage();
        updateProgressDisplay();
        showCelebration();

        return true;
    }

    /**
     * Check if an animal is collected
     * @param {string} animalId - Animal ID to check
     * @returns {boolean} Whether the animal is collected
     */
    function isCollected(animalId) {
        return collection.has(animalId);
    }

    /**
     * Get all collected animal IDs
     * @returns {Array} Array of collected animal IDs
     */
    function getCollectedIds() {
        return [...collection];
    }

    /**
     * Get collection progress
     * @param {number} total - Total number of animals
     * @returns {Object} Progress object with count and percentage
     */
    function getProgress(total = 20) {
        const count = collection.size;
        return {
            collected: count,
            total: total,
            percentage: Math.round((count / total) * 100)
        };
    }

    /**
     * Update the progress display in the header
     */
    function updateProgressDisplay() {
        const progressEl = document.getElementById('progress-count');
        if (progressEl) {
            progressEl.textContent = collection.size;
        }
    }

    /**
     * Show celebration animation for new discovery
     */
    function showCelebration() {
        const celebration = document.getElementById('celebration');
        if (!celebration) return;

        celebration.hidden = false;

        // Hide after animation
        setTimeout(() => {
            celebration.hidden = true;
        }, 1500);
    }

    /**
     * Show the collection gallery
     */
    function showGallery() {
        if (!modal || !grid) return;

        // Build gallery content
        renderGallery();

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }

    /**
     * Hide the collection gallery
     */
    function hideGallery() {
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    /**
     * Render the gallery grid
     */
    function renderGallery() {
        if (!grid) return;

        const animals = AnimalData.getAll();
        grid.innerHTML = '';

        animals.forEach(animal => {
            const item = createGalleryItem(animal);
            grid.appendChild(item);
        });
    }

    /**
     * Create a gallery item element
     * @param {Object} animal - Animal data object
     * @returns {HTMLElement} Gallery item element
     */
    function createGalleryItem(animal) {
        const isOwned = collection.has(animal.id);

        const item = document.createElement('div');
        item.className = `collection-item collection-item--${animal.rarity}`;
        item.classList.toggle('collection-item--collected', isOwned);
        item.classList.toggle('collection-item--undiscovered', !isOwned);

        if (isOwned) {
            const img = document.createElement('img');
            img.className = 'collection-item__image';
            img.src = animal.image;
            img.alt = animal.name;
            item.appendChild(img);
        } else {
            const silhouette = document.createElement('div');
            silhouette.className = 'collection-item__silhouette';
            item.appendChild(silhouette);
        }

        const name = document.createElement('span');
        name.className = 'collection-item__name';
        name.textContent = isOwned ? animal.name : '???';
        item.appendChild(name);

        // Click to view card if collected
        if (isOwned) {
            item.addEventListener('click', () => {
                hideGallery();
                Cards.show(animal, true);
            });
        }

        return item;
    }

    /**
     * Trigger print view
     * @param {string} mode - 'map' or 'cards'
     */
    function printView(mode) {
        document.body.classList.add('print-mode');
        document.body.dataset.printMode = mode;

        window.print();

        // Cleanup after print
        setTimeout(() => {
            document.body.classList.remove('print-mode');
            delete document.body.dataset.printMode;
        }, 100);
    }

    /**
     * Reset collection (for testing)
     */
    function reset() {
        collection.clear();
        saveToStorage();
        updateProgressDisplay();
    }

    // Public API
    return {
        init,
        collect,
        isCollected,
        getCollectedIds,
        getProgress,
        showGallery,
        hideGallery,
        reset
    };
})();
