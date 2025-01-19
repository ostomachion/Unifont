

document.documentElement.style.setProperty('--dpri', window.devicePixelRatio | 1);
document.documentElement.style.setProperty('--dpr', window.devicePixelRatio);

document.querySelectorAll('input[name="scale"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        const scaleValue = event.target.value; // Get the selected value
        document.documentElement.style.setProperty('--scale', scaleValue);
    });
});

populateGroups();
populateGlyphs();

function populateGroups() {
    const select = document.getElementById('category');
    select.onchange = populateGlyphs;
    let first = true;
    for (let group of window.emojiData) {
        if (!first) {
            select.appendChild(document.createElement('hr'));
        }

        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;
        for (let subgroup of group.subgroups) {
            const option = document.createElement('option');
            option.value = `${group.label}:${subgroup.label}`;
            option.textContent = subgroup.label;
            optgroup.appendChild(option);
        }

        select.appendChild(optgroup);
        first = false;
    }
}

async function populateGlyphs() {
    const selectedGroup = document.getElementById('category').value.split(':', 2);

    let emojiList = window.emojiData
        .find(g => g.label === selectedGroup[0])
        .subgroups
        .find(s => s.label === selectedGroup[1])
        .emoji;

    const tbody = document.getElementById('glyphs').getElementsByTagName('tbody')[0];
    tbody.textContent = '';

    const loadingSrc = 'glyphs/loading.gif';

    const domData = {};

    // Start with placeholders for most things just to get the structure and layout built as quickly as possible.
    for (const emoji of emojiList) {
        const data = {};

        const tr = document.createElement('tr');

        // Code Point
        const codeTd = document.createElement('td');
        codeTd.className = 'code';
        for (const codePoint of emoji.codePoints) {
            const codePointDiv = document.createElement('div');
            codePointDiv.className = 'code-point';
            codePointDiv.textContent = 'U+' + codePoint.toString(16).toUpperCase();
            codeTd.appendChild(codePointDiv);
        }

        tr.appendChild(codeTd);

        // CLDR Short Name
        const nameTd = document.createElement('td');
        nameTd.className = 'name';
        nameTd.textContent = emoji.name;
        tr.appendChild(nameTd);

        // Unifont Glyph
        const unifontTd = document.createElement('td');
        unifontTd.classList.add('unifont');

        // TODO: Actually look this up.
        const isTextStyleDefault = emoji.codePoints.length === 2 && emoji.codePoints[1] === 0xFE0F;
        if (emoji.codePoints.length === 1 || isTextStyleDefault) {
            data.unifontImg = document.createElement('img');
            data.unifontImg.src = loadingSrc;
            if (isTextStyleDefault) {
                data.unifontImg.classList.add('text-style-default');
            }
            unifontTd.appendChild(data.unifontImg);
        } else {
            unifontTd.textContent = 'N/A';
        }

        tr.appendChild(unifontTd);
        
        // New text style glyph
        // TODO: Set this.
        const isVariation = false;
        const textTd = document.createElement('td');
        textTd.classList.add('text');
        if (isVariation) {
            data.textImg = document.createElement('img');
            data.textImg.src = loadingSrc;
            textTd.appendChild(textImg);
        } 
        
        tr.appendChild(textTd);
        
        // New monochrome emoji style glyph
        const emojiTd = document.createElement('td');
        emojiTd.classList.add('emoji');
        data.emojiImg = document.createElement('img');
        data.emojiImg.src = loadingSrc;
        emojiTd.appendChild(data.emojiImg);
        tr.appendChild(emojiTd);

        // New color emoji style glyph
        const colorTd = document.createElement('td');
        colorTd.classList.add('color');
        data.colorImg = document.createElement('img');
        data.colorImg.src = loadingSrc;
        colorTd.appendChild(data.colorImg);
        tr.appendChild(colorTd);
        
        tbody.appendChild(tr);

        domData[emoji.name] = data;
    }
    
    for (const emoji of emojiList) {
        const data = domData[emoji.name];

        const fileName = emoji.codePoints[0].toString(16).padStart(6, '0').toUpperCase();

        // Now take the time to load the images.

        // Unifont Glyph
        if (typeof data.unifontImg !== 'undefined') {
            // TODO: Actually look this up.
            const isTextStyleDefault = emoji.codePoints.length === 2 && emoji.codePoints[1] === 0xFE0F;
            const unifontSrc = `glyphs/${emoji.name}/${fileName}.png`;
            const fallbackSrc = `glyphs/TODO/${fileName}.png`;
            const unifontImg = await getValidImage(unifontSrc, fallbackSrc);
            if (isTextStyleDefault) {
                unifontImg.classList.add('text-style-default');
            }

            data.unifontImg.replaceWith(unifontImg);
        }

        // New text style glyph
        if (typeof data.textImg !== 'undefined') {
            const textSrc = `glyphs/${emoji.name}/${fileName}-text.png`;
            const textImg = await getValidImage(textSrc, 'glyphs/TODO/TODO-text.png');
            data.textImg.replaceWith(textImg);
        }

        // New monochrome emoji style glyph.
        const emojiSrc = `glyphs/${emoji.name}/${fileName}-emoji.png`;
        const emojiImg = await getValidImage(emojiSrc, 'glyphs/TODO/TODO-emoji.png');
        data.emojiImg.replaceWith(emojiImg);

        // New color emoji style glyph.
        const colorSrc = `glyphs/${emoji.name}/${fileName}-color.png`;
        const colorImg = await getValidImage(colorSrc, 'glyphs/TODO/TODO-color.png');
        data.colorImg.replaceWith(colorImg);
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
