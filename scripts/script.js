

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

    for (const emoji of emojiList) {
        const fileName = emoji.codePoints[0].toString(16).padStart(6, '0');

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

        if (emoji.codePoints.length === 1) {
            const unifontSrc = `glyphs/${emoji.name}/${fileName}.png`;
            const fallbackSrc = `glyphs/TODO/${fileName}.png`;
            const img = await getValidImage(unifontSrc, fallbackSrc);
            unifontTd.appendChild(img);
        } else {
            unifontTd.textContent = 'N/A';
        }

        tr.appendChild(unifontTd);
        
        // Text

        // TODO:
        const isEmojiPresentation = false;
        const isVariation = false;

        const textTd = document.createElement('td');
        textTd.classList.add('text');
        if (!isEmojiPresentation) {
            textTd.classList.add('default');
        }

        if (isVariation) {
            const textSrc = `glyphs/${emoji.name}/${fileName}-text.png`;
            const textImg = await getValidImage(textSrc, 'glyphs/TODO/TODO-text.png');
            textTd.appendChild(textImg);
        } 
        
        tr.appendChild(textTd);
        
        // Emoji
        const emojiTd = document.createElement('td');
        emojiTd.classList.add('emoji');
        if (isEmojiPresentation) {
            emojiTd.classList.add('default');
        }

        const emojiSrc = `glyphs/${emoji.name}/${fileName}-emoji.png`;
        const emojiImg = await getValidImage(emojiSrc, 'glyphs/TODO/TODO-emoji.png');
        emojiTd.appendChild(emojiImg);

        tr.appendChild(emojiTd);

        // Color
        const colorTd = document.createElement('td');
        colorTd.classList.add('color');

        const colorSrc = `glyphs/${emoji.name}/${fileName}-color.png`;
        const colorImg = await getValidImage(colorSrc, 'glyphs/TODO/TODO-color.png');
        colorTd.appendChild(colorImg);
        
        tr.appendChild(colorTd);
        
        tbody.appendChild(tr);
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
