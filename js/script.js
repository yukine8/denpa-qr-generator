const qrCodeElement = document.getElementById('qrcode');
const qrTextElement = document.getElementById('qr-text');
const historyElement = document.getElementById('history');
const regenerateBtn = document.getElementById('regenerate-btn');
const saveBtn = document.getElementById('save-btn');

let historyCount = 0;

// SVG生成関数（デモから移植）
function toSvgString(qr, border, lightColor = "#ffffff", darkColor = "#000000") {
    if (border < 0) throw new RangeError("Border must be non-negative");
    let parts = [];
    for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
            if (qr.getModule(x, y))
                parts.push(`M${x + border},${y + border}h1v1h-1z`);
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
    <rect width="100%" height="100%" fill="${lightColor}"/>
    <path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(x => characters[x % characters.length])
        .join('');
}

function generateQRCode(text) {
    qrCodeElement.innerHTML = ''; // クリア

    const randomString = text || generateRandomString(127);
    qrTextElement.textContent = randomString;

    const qr = qrcodegen.QrCode.encodeText(randomString, qrcodegen.QrCode.Ecc.MEDIUM);
    const svgString = toSvgString(qr, 4); // 白枠4モジュール
    qrCodeElement.innerHTML = svgString;

    if (!text) {
        historyCount++;
        const listItem = document.createElement('li');
        listItem.classList.add('historyElement');
        const shortenedText = randomString.substring(0, 16) + "...";
        listItem.textContent = `${historyCount}. ${shortenedText}`;
        listItem.addEventListener('click', () => generateQRCode(randomString));
        historyElement.appendChild(listItem);
    }
}

function saveQRCode() {
    const svgElement = qrCodeElement.querySelector('svg');

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgSize = 400;
    const padding = 20;
    canvas.width = svgSize + padding * 2;
    canvas.height = svgSize + padding * 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
        ctx.drawImage(img, padding, padding, svgSize, svgSize);
        URL.revokeObjectURL(url);

        const link = document.createElement('a');
        const fileName = prompt("保存するファイル名を入力してください (拡張子不要)", "QRCode");
        if (fileName) {
            link.href = canvas.toDataURL('image/png');
            link.download = `${fileName}.png`;
            link.click();
        }
    };
    img.src = url;
}

function initialize() {
    generateQRCode();
    regenerateBtn.addEventListener('click', () => generateQRCode());
    saveBtn.addEventListener('click', saveQRCode);

    window.addEventListener('keydown', (event) => {
        // キーリピートを防ぐ
        if (event.repeat) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // デフォルト動作を抑制
            generateQRCode();
        } else if (event.key === 's' || event.key === 'S') {
            event.preventDefault();
            saveQRCode();
        }
    });
}

window.addEventListener('load', () => {
    initialize();
});