

document.documentElement.style.setProperty('--dpri', window.devicePixelRatio | 1);
document.documentElement.style.setProperty('--dpr', window.devicePixelRatio);

document.querySelectorAll('input[name="scale"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        const scaleValue = event.target.value; // Get the selected value
        document.documentElement.style.setProperty('--scale', scaleValue);
    });
});

populateGroups('unifont-category', populateUnifontGlyphs);
populateGroups('comfont-category', populateComfontGlyphs);
populateUnifontGlyphs();
populateComfontGlyphs();

function populateGroups(id, changeCallback) {
    const select = document.getElementById(id);
    select.onchange = changeCallback;
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

async function populateUnifontGlyphs() {
    const hexTextArea = document.getElementById('hex');
    hexTextArea.value = 'Loading...';
    let hexValue = '';

    const selectedGroup = document.getElementById('unifont-category').value.split(':', 2);

    let emojiList = window.emojiData
        .find(g => g.label === selectedGroup[0])
        .subgroups
        .find(s => s.label === selectedGroup[1])
        .emoji;

    const tbody = document.getElementById('unifont-glyphs').getElementsByTagName('tbody')[0];
    tbody.textContent = '';

    const loadingSrc = 'glyphs/loading.gif';

    const domData = {};

    // Start with placeholders for most things just to get the structure and layout built as quickly as possible.
    for (const emoji of emojiList) {
        const data = {};
        data.isSingleCodePoint = emoji.codePoints.length == 1 || emoji.codePoints.length == 2 && emoji.codePoints[1] === 0xFE0F;
        data.hasTextStyleVariation = data.isSingleCodePoint && window.variationCodePoints.includes(emoji.codePoints[0]);
        data.isEmojiPresentation = !data.isSingleCodePoint || window.emojiPresentationCodePoints.includes(emoji.codePoints[0]);

        if (!data.isSingleCodePoint)
            continue;

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

        // Unicode Name
        const nameTd = document.createElement('td');
        nameTd.className = 'name';
        nameTd.textContent = emoji.name;
        tr.appendChild(nameTd);

        // Representative Glyph
        const representativeTd = document.createElement('td');
        representativeTd.classList.add('representative');
        data.reprImg = document.createElement('img');
        data.reprImg.src = loadingSrc;
        representativeTd.appendChild(data.reprImg);
        tr.appendChild(representativeTd);


        // Unifont Glyph
        const unifontTd = document.createElement('td');
        unifontTd.classList.add('unifont');

        if (data.isSingleCodePoint) {
            data.unifontImg = document.createElement('img');
            data.unifontImg.src = loadingSrc;
            if (!data.isEmojiPresentation) {
                data.unifontImg.classList.add('text-style-default');
            }
            unifontTd.appendChild(data.unifontImg);
        } else {
            unifontTd.textContent = 'N/A';
        }

        tr.appendChild(unifontTd);
        
        // New text style glyph
        const textTd = document.createElement('td');
        textTd.classList.add('text');
        data.textImg = document.createElement('img');
        data.textImg.src = loadingSrc;
        textTd.appendChild(data.textImg);
        
        tr.appendChild(textTd);
          
        // Diff
        const diffTd = document.createElement('td');
        diffTd.classList.add('diff');
        data.diffCanvas = document.createElement('canvas');
        diffTd.appendChild(data.diffCanvas);
        
        tr.appendChild(diffTd);
        
        tbody.appendChild(tr);

        domData[emoji.shortName] = data;
    }
    
    for (const emoji of emojiList) {
        const data = domData[emoji.shortName];
        if (!data)
            continue;

        const fileName = emoji.codePoints[0].toString(16).padStart(6, '0').toUpperCase();

        // Now take the time to load the images.

        // Representative
        if (typeof data.reprImg !== 'undefined') {
            const reprSrc = `glyphs/${emoji.shortName}/${fileName}-repr.png`;
            const reprImg = await getValidImage(reprSrc, 'glyphs/TODO/TODO-text.png');
            reprImg.width = 32;
            reprImg.height = 32;
            data.reprImg.replaceWith(reprImg);
        }

        // Unifont Glyph
        if (typeof data.unifontImg !== 'undefined') {
            const unifontSrc = `glyphs/${emoji.shortName}/${fileName}.png`;
            const fallbackSrc = `glyphs/TODO/${fileName}.png`;
            const unifontImg = await getValidImage(unifontSrc, fallbackSrc);
            data.unifontImg.replaceWith(unifontImg);
            data.unifontHex = getHex(unifontImg);
        }

        const textSrc = `glyphs/${emoji.shortName}/${fileName}-text.png`;
        const hasTextImg = await validateImage(textSrc);

        // New text style glyph
        if (typeof data.textImg !== 'undefined') {
            const textImg = await getValidImage(textSrc, 'glyphs/TODO/TODO-text.png');
            data.textImg.replaceWith(textImg);
            data.textHex = getHex(textImg);
            if (data.textHex === data.unifontHex) {
                textImg.classList.add('unchanged');
            } else if (hasTextImg) {
                hexValue += fileName.replace(/^0+/, '').padStart(4, '0') + ':' + data.textHex + '\n';
            }
        }

        // Diff
        if (typeof data.unifontImg !== 'undefined' && hasTextImg) {
            drawDiff(data.diffCanvas, data.unifontHex, data.textHex);
        }
    }

    hexTextArea.value = hexValue;
}

async function populateComfontGlyphs() {
    // TODO:

    // // New monochrome emoji style glyph
    // const emojiTd = document.createElement('td');
    // emojiTd.classList.add('emoji');
    // data.emojiImg = document.createElement('img');
    // data.emojiImg.src = loadingSrc;
    // emojiTd.appendChild(data.emojiImg);
    // tr.appendChild(emojiTd);

    // // New color emoji style glyph
    // const colorTd = document.createElement('td');
    // colorTd.classList.add('color');
    // data.colorImg = document.createElement('img');
    // data.colorImg.src = loadingSrc;
    // colorTd.appendChild(data.colorImg);
    // tr.appendChild(colorTd);

    // for (const emoji of emojiList) {
    //     const data = domData[emoji.shortName];

    //     const fileName = emoji.codePoints[0].toString(16).padStart(6, '0').toUpperCase();

    //     // Now take the time to load the images.
    //     // New monochrome emoji style glyph.
    //     const emojiSrc = `glyphs/${emoji.shortName}/${fileName}-emoji.png`;
    //     const emojiImg = await getValidImage(emojiSrc, 'glyphs/TODO/TODO-emoji.png');
    //     data.emojiImg.replaceWith(emojiImg);

    //     // New color emoji style glyph.
    //     const colorSrc = `glyphs/${emoji.shortName}/${fileName}-color.png`;
    //     const colorImg = await getValidImage(colorSrc, 'glyphs/TODO/TODO-color.png');
    //     data.colorImg.replaceWith(colorImg);
    // }
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

function getHex(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, 16, 16, { colorSpace: 'srgb' });

    let hex = '';
    for (let i = 0; i < data.length; i += 16) {
        const hexDigit =
            8 * (data[i + 3] > 0) +
            4 * (data[i + 7] > 0) +
            2 * (data[i + 11] > 0) +
            (data[i + 15] > 0);

        hex += hexDigit.toString(16);
    }

    return hex;
}

function drawDiff(canvas, oldHex, newHex) {
    canvas.width = 256;
    canvas.height = 256;

    const red = window.getComputedStyle(document.body).getPropertyValue('--red');
    const green = window.getComputedStyle(document.body).getPropertyValue('--green');

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < 64; i++) {
        const oldHexDigit = +`0x${oldHex[i]}`;
        const newHexDigit = +`0x${newHex[i]}`;
        for (let b = 0; b < 4; b++) {
            const oldBit = (oldHexDigit >> b) % 2;
            const newBit = (newHexDigit >> b) % 2;

            const y = ((4 * i + (3 - b)) / 16) | 0;
            const x = (4 * i + (3 - b)) % 16;

            if (oldBit === 1 && newBit === 1) {
                ctx.fillStyle = '#00000022';
                ctx.fillRect(x * 16, y * 16, 16, 16);
            } else if (oldBit === 1 && newBit === 0) {
                ctx.fillStyle = red;
                ctx.fillRect(x * 16, y * 16, 16, 16);
            } else if (oldBit === 0 && newBit === 1) {
                ctx.fillStyle = green;
                ctx.fillRect(x * 16, y * 16, 16, 16);
            }
        }
    }
}
