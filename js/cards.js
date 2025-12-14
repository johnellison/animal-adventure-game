/* ========================================
   Cards Module - Pokemon-Style Animal Cards
   ======================================== */

const Cards = (function() {
    'use strict';

    let modal = null;
    let currentAnimal = null;

    // DOM element references
    const elements = {};

    /**
     * Initialize the cards module
     */
    function init() {
        modal = document.getElementById('animal-modal');
        if (!modal) {
            console.error('Animal modal not found');
            return;
        }

        // Cache DOM elements
        elements.rarity = document.getElementById('card-rarity');
        elements.type = document.getElementById('card-type');
        elements.image = document.getElementById('card-image');
        elements.name = document.getElementById('modal-title');
        elements.habitat = document.getElementById('card-habitat');
        elements.factsList = document.getElementById('card-facts-list');
        elements.statSize = document.getElementById('stat-size');
        elements.statSpeed = document.getElementById('stat-speed');
        elements.statDanger = document.getElementById('stat-danger');
        elements.speechPractice = document.getElementById('speech-practice');
        elements.phonetic = document.getElementById('phonetic-display');
        elements.speechTip = document.getElementById('speech-tip');
        elements.btnSpeak = document.getElementById('btn-speak');
        elements.btnCollect = document.getElementById('btn-collect');

        // Setup close handlers
        setupCloseHandlers();

        console.log('Cards module initialized');
    }

    /**
     * Setup modal close handlers
     */
    function setupCloseHandlers() {
        // Close button and overlay clicks
        modal.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', hide);
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hide();
            }
        });
    }

    /**
     * Show the animal card modal
     * @param {Object} animal - Animal data object
     * @param {boolean} isCollected - Whether animal is already collected
     */
    function show(animal, isCollected = false) {
        currentAnimal = animal;

        // Set card content
        elements.name.textContent = animal.name;
        elements.image.src = animal.image;
        elements.image.alt = animal.name;
        elements.habitat.textContent = animal.habitat;

        // Rarity and type
        elements.rarity.textContent = capitalize(animal.rarity);
        elements.rarity.className = `card__rarity card__rarity--${animal.rarity}`;
        elements.type.textContent = animal.category === 'dinosaur' ? 'Dinosaur' : 'Deadly';

        // Set card rarity class
        modal.querySelector('.card').className = `modal__content card card--${animal.rarity}`;

        // Stats (percentage-based, max 10)
        setStatBar(elements.statSize, animal.stats.size);
        setStatBar(elements.statSpeed, animal.stats.speed);
        setStatBar(elements.statDanger, animal.stats.dangerLevel);

        // Fun facts
        elements.factsList.innerHTML = '';
        animal.facts.forEach(fact => {
            const li = document.createElement('li');
            li.textContent = fact;
            elements.factsList.appendChild(li);
        });

        // Speech practice section
        if (animal.speechPractice && animal.speechPractice.hasGKSound) {
            elements.speechPractice.hidden = false;
            elements.phonetic.innerHTML = formatPhonetic(
                animal.speechPractice.phonetic,
                animal.speechPractice.targetSound
            );
            elements.speechTip.textContent = animal.speechPractice.tip;
        } else {
            elements.speechPractice.hidden = true;
        }

        // Collect button state
        if (isCollected) {
            elements.btnCollect.disabled = true;
            elements.btnCollect.innerHTML = '<span class="btn__icon">✓</span> Collected!';
        } else {
            elements.btnCollect.disabled = false;
            elements.btnCollect.innerHTML = '<span class="btn__icon">⭐</span> Collect!';
        }

        // Show modal with animation
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Focus management for accessibility
        elements.btnSpeak.focus();
    }

    /**
     * Hide the animal card modal
     */
    function hide() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Stop any speech
        if (typeof Speech !== 'undefined' && Speech.isSpeaking()) {
            Speech.stop();
        }

        currentAnimal = null;
    }

    /**
     * Get the currently displayed animal
     * @returns {Object|null} Current animal or null
     */
    function getCurrentAnimal() {
        return currentAnimal;
    }

    /**
     * Update collect button state
     * @param {boolean} collected - Whether collected
     */
    function setCollected(collected) {
        if (collected) {
            elements.btnCollect.disabled = true;
            elements.btnCollect.innerHTML = '<span class="btn__icon">✓</span> Collected!';
        }
    }

    /**
     * Set stat bar width
     * @param {HTMLElement} element - Stat fill element
     * @param {number} value - Stat value (1-10)
     */
    function setStatBar(element, value) {
        const percentage = (value / 10) * 100;
        element.style.width = `${percentage}%`;
    }

    /**
     * Format phonetic text with highlighted target sound
     * @param {string} phonetic - Phonetic spelling
     * @param {string} targetSound - Sound to highlight
     * @returns {string} HTML with highlighted sound
     */
    function formatPhonetic(phonetic, targetSound) {
        const regex = new RegExp(`(${targetSound})`, 'gi');
        return phonetic.replace(regex, '<span class="highlight">$1</span>');
    }

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Public API
    return {
        init,
        show,
        hide,
        getCurrentAnimal,
        setCollected
    };
})();
