
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
            const unifontSrc = `glyphs/${no} - ${name}/${fileName}.png`;
            const fallbackSrc = `TODO/${fileName}.png`;
            const img = await getValidImage(unifontSrc, fallbackSrc);
            unifontTd.appendChild(img);
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
            const textSrc = `glyphs/${no} - ${name}/${fileName}-text.png`;
            const textImg = await getValidImage(textSrc, 'TODO/TODO-text.png');
            textTd.appendChild(textImg);
        }
        
        row.appendChild(textTd);

        // Emoji
        const emojiTd = document.createElement('td');
        emojiTd.classList.add('emoji');
        if (isEmojiPresentation) {
            emojiTd.classList.add('default');
        }

        const emojiSrc = `glyphs/${no} - ${name}/${fileName}-emoji.png`;
        const emojiImg = await getValidImage(emojiSrc, 'TODO/TODO-emoji.png');
        emojiTd.appendChild(emojiImg);

        row.appendChild(emojiTd);

        // Color
        const colorTd = document.createElement('td');
        colorTd.classList.add('color');

        const colorSrc = `glyphs/${no} - ${name}/${fileName}-color.png`;
        const colorImg = await getValidImage(colorSrc, 'TODO/TODO-color.png');
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

async function getValidImage(...urls) {
    for (let i = 0; i < urls.length - 1; i++) {
        const img = await validateImage(urls[i]);
        if (img) {
            return img;
        }
    }

    // Return the fallback image (last argument) without testing
    const fallbackUrl = urls[urls.length - 1];
    const fallbackImg = new Image();
    fallbackImg.src = fallbackUrl;
    return fallbackImg;
}

function validateImage(url) {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(img);  // Image loaded successfully
        img.onerror = () => resolve(undefined); // Failed to load the image

        img.src = url; // Start loading the image
    });
}
