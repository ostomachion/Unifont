
document.documentElement.style.setProperty('--dpr', window.devicePixelRatio);

document.querySelectorAll('input[name="scale"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        const scaleValue = event.target.value; // Get the selected value
        document.documentElement.style.setProperty('--scale', scaleValue);
    });
});

populate();

async function populate() {
    const rows = document.querySelectorAll('table tr:has(td)');
    for (const row of rows) {
        const no = row.children[0].textContent.trim();

        const code = row.children[1].textContent.match(/\s*U\+([0-9A-F]+)\s*/gi)
            .map(code => parseInt(code.slice(2), 16));

        const fileName = code
            .map(n => n.toString(16).toUpperCase().padStart(6, '0'))
            .join('');
        
        const isSingleCodePoint = code.length === 1;

        const name = row.children[2].textContent.trim();

        const isVariation = isSingleCodePoint && window.variationCodePoints.includes(code[0]);
        const isEmojiPresentation = !isSingleCodePoint || window.emojiPresentationCodePoints.includes(code[0]);

        // Unifont
        const unifontTd = document.createElement('td');
        unifontTd.classList.add('unifont');

        if (isSingleCodePoint) {
            const unifontSrc = `${no} - ${name}/${fileName}.png`;
            const fallbackSrc = `${fileName}.png`;
            if (await isImageValid(unifontSrc)) {
                const unifontImg = document.createElement('img');
                unifontImg.setAttribute('src', unifontSrc);
                unifontTd.appendChild(unifontImg);
            } else if (await isImageValid(fallbackSrc)) {
                const unifontImg = document.createElement('img');
                unifontImg.setAttribute('src', fallbackSrc);
                unifontTd.appendChild(unifontImg);
            } else {
                unifontTd.textContent = '???';
            }
        } else {
            unifontTd.textContent = 'N/A';
        }

        row.appendChild(unifontTd);

        // Text
        const textTd = document.createElement('td');
        textTd.classList.add('text');
        if (!isEmojiPresentation) {
            textTd.classList.add('default');
        }

        if (isVariation) {
            let textSrc = `${no} - ${name}/${fileName}-rev.png`;
            if (!(await isImageValid(textSrc))) {
                textSrc = 'TODO-text.png'
            }

            const textImg = document.createElement('img');
            textImg.setAttribute('src', 'TODO-text.png');
            textTd.appendChild(textImg);
        }
        
        row.appendChild(textTd);

        // Emoji
        const emojiTd = document.createElement('td');
        emojiTd.classList.add('emoji');
        if (isEmojiPresentation) {
            emojiTd.classList.add('default');
        }

        let emojiSrc = `${no} - ${name}/${fileName}-emoji.png`;
        if (!(await isImageValid(emojiSrc))) {
            emojiSrc = 'TODO-emoji.png';
        }

        const emojiImg = document.createElement('img');
        emojiImg.setAttribute('src', emojiSrc);
        emojiTd.appendChild(emojiImg);

        row.appendChild(emojiTd);

        // Color
        const colorTd = document.createElement('td');
        colorTd.classList.add('color');

        let colorSrc = `${no} - ${name}/${fileName}-color.png`;
        if (!(await isImageValid(colorSrc))) {
            colorSrc = 'TODO-color.png';
        }

        const colorImg = document.createElement('img');
        colorImg.setAttribute('src', colorSrc);
        colorTd.appendChild(colorImg);
        
        row.appendChild(colorTd);

        // Noto Text
        const notoTextTd = document.createElement('td');
        notoTextTd.classList.add('noto-text');
        if (isVariation && isSingleCodePoint) {
            notoTextTd.textContent = String.fromCodePoint(code[0]) + '\uFE0E';
        }

        row.append(notoTextTd);

        // Noto Emoji
        const notoEmojiTd = document.createElement('td');
        notoEmojiTd.classList.add('noto-emoji');
        if (isSingleCodePoint) {
            notoEmojiTd.textContent = String.fromCodePoint(code[0]) + '\uFE0E';
        }

        row.append(notoEmojiTd);

        // Noto Color
        const notoColorTd = document.createElement('td');
        notoColorTd.classList.add('noto-color');
        notoColorTd.textContent = code.map(c => String.fromCodePoint(c)).join('');
        row.append(notoColorTd);
    }
}

function isImageValid(url) {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(true);  // Image loaded successfully
        img.onerror = () => resolve(false); // Failed to load the image

        img.src = url; // Start loading the image
    });
}
