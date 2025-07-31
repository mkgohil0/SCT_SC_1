// --- DOM Element References ---
const inputText = document.getElementById('inputText');
const shiftValue = document.getElementById('shiftValue');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// --- THEME TOGGLE LOGIC ---

// Function to set the theme
function setTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
        localStorage.setItem('color-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleLightIcon.classList.add('hidden');
        themeToggleDarkIcon.classList.remove('hidden');
        localStorage.setItem('color-theme', 'light');
    }
}

// Check for saved theme preference or system preference on page load
if (localStorage.getItem('color-theme') === 'dark' || 
   (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
} else {
    setTheme(false);
}

// Theme toggle button event listener
themeToggleBtn.addEventListener('click', () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setTheme(!isDarkMode);
});


// --- CAESAR CIPHER LOGIC ---

/**
 * Encrypts or decrypts text using the Caesar Cipher algorithm.
 * @param {string} text - The input string to process.
 * @param {number} shift - The number of positions to shift letters.
 * @param {string} mode - 'encrypt' or 'decrypt'.
 * @returns {string} The processed (encrypted or decrypted) string.
 */
function caesarCipher(text, shift, mode) {
    let result = "";
    if (mode === 'decrypt') {
        shift = -shift;
    }
    // Ensure the shift is always a positive number between 0 and 25 for the calculation
    const effectiveShift = (shift % 26 + 26) % 26;

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        // Check if the character is an alphabet letter
        if (char.match(/[a-z]/i)) {
            let code = text.charCodeAt(i);
            // Handle uppercase letters
            if (code >= 65 && code <= 90) {
                char = String.fromCharCode(((code - 65 + effectiveShift) % 26) + 65);
            } 
            // Handle lowercase letters
            else if (code >= 97 && code <= 122) {
                char = String.fromCharCode(((code - 97 + effectiveShift) % 26) + 97);
            }
        }
        result += char;
    }
    return result;
}

// --- Event Listeners ---

// Encrypt button click handler
encryptBtn.addEventListener('click', () => {
    const text = inputText.value;
    const shift = parseInt(shiftValue.value, 10);
    if (!text) {
        resultText.value = "Please enter a message to encrypt.";
        return;
    }
    resultText.value = caesarCipher(text, shift, 'encrypt');
});

// Decrypt button click handler
decryptBtn.addEventListener('click', () => {
    const text = inputText.value;
    const shift = parseInt(shiftValue.value, 10);
    if (!text) {
        resultText.value = "Please enter a message to decrypt.";
        return;
    }
    resultText.value = caesarCipher(text, shift, 'decrypt');
});

// Copy to clipboard button handler
copyBtn.addEventListener('click', () => {
    const textToCopy = resultText.value;
    if (textToCopy) {
        // Use the modern Clipboard API if available, with a fallback
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>`;
                setTimeout(() => {
                     copyBtn.innerHTML = `
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>`;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text with navigator: ', err);
            });
        } else {
            // Fallback for older browsers
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy text with execCommand: ', err);
            }
            document.body.removeChild(tempTextArea);
        }
    }
});
