/* ========================================
   Data Module - Animal Data Management
   ======================================== */

const AnimalData = (function() {
    'use strict';

    let animals = [];
    let loaded = false;

    /**
     * Load animals from JSON file
     * @returns {Promise<Array>} Array of animal objects
     */
    async function loadAnimals() {
        if (loaded) return animals;

        try {
            const response = await fetch('data/animals.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            animals = await response.json();
            loaded = true;
            console.log(`Loaded ${animals.length} animals`);
            return animals;
        } catch (error) {
            console.error('Error loading animal data:', error);
            // Return empty array on error
            return [];
        }
    }

    /**
     * Get all animals
     * @returns {Array} Array of all animals
     */
    function getAll() {
        return [...animals];
    }

    /**
     * Get animal by ID
     * @param {string} id - Animal ID
     * @returns {Object|null} Animal object or null
     */
    function getById(id) {
        return animals.find(animal => animal.id === id) || null;
    }

    /**
     * Get animals by category
     * @param {string} category - 'deadly' or 'dinosaur'
     * @returns {Array} Filtered animals
     */
    function getByCategory(category) {
        return animals.filter(animal => animal.category === category);
    }

    /**
     * Get animals by habitat type
     * @param {string} habitat - 'land' or 'sea'
     * @returns {Array} Filtered animals
     */
    function getByHabitat(habitat) {
        return animals.filter(animal => animal.habitat === habitat);
    }

    /**
     * Get animals with G/K sounds for speech practice
     * @returns {Array} Animals with hasGKSound = true
     */
    function getGKSoundAnimals() {
        return animals.filter(animal =>
            animal.speechPractice && animal.speechPractice.hasGKSound
        );
    }

    /**
     * Get animals by rarity
     * @param {string} rarity - 'common', 'uncommon', 'rare', 'legendary'
     * @returns {Array} Filtered animals
     */
    function getByRarity(rarity) {
        return animals.filter(animal => animal.rarity === rarity);
    }

    /**
     * Check if data is loaded
     * @returns {boolean}
     */
    function isLoaded() {
        return loaded;
    }

    // Public API
    return {
        loadAnimals,
        getAll,
        getById,
        getByCategory,
        getByHabitat,
        getGKSoundAnimals,
        getByRarity,
        isLoaded
    };
})();
