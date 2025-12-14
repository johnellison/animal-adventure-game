/* ========================================
   Speech Module - Web Speech API TTS
   ======================================== */

const Speech = (function() {
    'use strict';

    let synth = null;
    let speaking = false;
    let supported = false;
    let voices = [];

    /**
     * Initialize the speech module
     */
    function init() {
        // Check for Web Speech API support
        if ('speechSynthesis' in window) {
            synth = window.speechSynthesis;
            supported = true;

            // Load voices (may need to wait for voiceschanged event)
            loadVoices();
            synth.onvoiceschanged = loadVoices;

            console.log('Speech module initialized - Web Speech API supported');
        } else {
            console.warn('Web Speech API not supported in this browser');
            hideSpeak();
        }

        // Setup speak button
        const speakBtn = document.getElementById('btn-speak');
        if (speakBtn) {
            speakBtn.addEventListener('click', handleSpeakClick);
        }
    }

    /**
     * Load available voices
     */
    function loadVoices() {
        voices = synth.getVoices();

        // Prefer English voices
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        if (englishVoices.length > 0) {
            console.log(`Found ${englishVoices.length} English voices`);
        }
    }

    /**
     * Get the best available English voice
     * @returns {SpeechSynthesisVoice|null} Best voice or null
     */
    function getBestVoice() {
        if (voices.length === 0) return null;

        // Prefer Australian English for our Australian animals!
        const aussie = voices.find(v => v.lang === 'en-AU');
        if (aussie) return aussie;

        // Fallback to other English voices
        const english = voices.find(v => v.lang.startsWith('en'));
        if (english) return english;

        // Use default
        return voices[0];
    }

    /**
     * Handle speak button click
     */
    function handleSpeakClick() {
        if (speaking) {
            stop();
            return;
        }

        const animal = Cards.getCurrentAnimal();
        if (!animal) return;

        // Build speech text
        const text = buildSpeechText(animal);
        speak(text);
    }

    /**
     * Build speech text from animal data
     * @param {Object} animal - Animal data object
     * @returns {string} Text to speak
     */
    function buildSpeechText(animal) {
        const parts = [];

        // Name with emphasis
        parts.push(animal.name);

        // Category
        const category = animal.category === 'dinosaur'
            ? 'is an Australian dinosaur'
            : 'is one of Australia\'s deadly creatures';
        parts.push(category);

        // Facts
        if (animal.facts && animal.facts.length > 0) {
            parts.push('Here are some fun facts:');
            animal.facts.forEach((fact, i) => {
                parts.push(`Fact ${i + 1}: ${fact}`);
            });
        }

        // G/K sound practice prompt
        if (animal.speechPractice && animal.speechPractice.hasGKSound) {
            parts.push(`Now let's practice saying ${animal.name}!`);
            parts.push(`Listen for the ${animal.speechPractice.targetSound.toUpperCase()} sound.`);
        }

        return parts.join('. ');
    }

    /**
     * Speak text using Web Speech API
     * @param {string} text - Text to speak
     * @param {Object} options - Speech options
     */
    function speak(text, options = {}) {
        if (!supported || !synth) {
            console.warn('Speech synthesis not available');
            return;
        }

        // Cancel any current speech
        stop();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice
        const voice = getBestVoice();
        if (voice) {
            utterance.voice = voice;
        }

        // Set options
        utterance.rate = options.rate || 0.9; // Slightly slower for kids
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Event handlers
        utterance.onstart = () => {
            speaking = true;
            updateSpeakButton(true);
        };

        utterance.onend = () => {
            speaking = false;
            updateSpeakButton(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            speaking = false;
            updateSpeakButton(false);
        };

        // Speak!
        synth.speak(utterance);
    }

    /**
     * Stop current speech
     */
    function stop() {
        if (synth) {
            synth.cancel();
        }
        speaking = false;
        updateSpeakButton(false);
    }

    /**
     * Check if currently speaking
     * @returns {boolean} Whether speech is active
     */
    function isSpeaking() {
        return speaking;
    }

    /**
     * Check if speech is supported
     * @returns {boolean} Whether TTS is supported
     */
    function isSupported() {
        return supported;
    }

    /**
     * Update speak button visual state
     * @param {boolean} isSpeaking - Whether currently speaking
     */
    function updateSpeakButton(isSpeaking) {
        const btn = document.getElementById('btn-speak');
        if (!btn) return;

        btn.classList.toggle('speaking', isSpeaking);

        if (isSpeaking) {
            btn.innerHTML = '<span class="btn__icon">🔇</span> Stop';
        } else {
            btn.innerHTML = '<span class="btn__icon">🔊</span> Read to Me';
        }
    }

    /**
     * Hide speak button when not supported
     */
    function hideSpeak() {
        const btn = document.getElementById('btn-speak');
        if (btn) {
            btn.style.display = 'none';
        }
    }

    /**
     * Speak just the animal name (for practice)
     * @param {string} name - Animal name to speak
     */
    function speakName(name) {
        speak(name, { rate: 0.7 }); // Extra slow for pronunciation practice
    }

    // Public API
    return {
        init,
        speak,
        speakName,
        stop,
        isSpeaking,
        isSupported
    };
})();
