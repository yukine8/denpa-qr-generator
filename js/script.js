const qrCodeElement = document.getElementById('qrcode');
const qrTextElement = document.getElementById('qr-text');
const historyElement = document.getElementById('history');
const regenerateBtn = document.getElementById('regenerate-btn');
const saveBtn = document.getElementById('save-btn');

let historyCount = 0; // 番号カウンター

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(x => characters[x % characters.length])
        .join('');
}

function generateQRCode(text) {
    qrCodeElement.innerHTML = '';
    // 127文字以上だとiOSとAndroidで出現する電波人間が違う
    const randomString = text || generateRandomString(126);
    qrTextElement.textContent = randomString;

    new QRCode(qrCodeElement, {
        text: randomString,
        width: 400,
        height: 400
    });

    if (!text) {
        historyCount++;

        const listItem = document.createElement('li');
        listItem.classList.add('historyElement');

        // 短縮表示
        const shortenedText = randomString.substring(0, 16) + "...";

        listItem.textContent = `${historyCount}. ${shortenedText}`;
        listItem.addEventListener('click', () => generateQRCode(randomString));

        historyElement.appendChild(listItem);
    }
}

function saveQRCode() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        const padding = 20;
        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");

        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
        ctx.drawImage(canvas, padding, padding);

        const link = document.createElement("a");
        const fileName = prompt("保存するファイル名を入力してください (拡張子不要)", "QRCode");
        if (fileName) {
            link.href = paddedCanvas.toDataURL("image/png");
            link.download = `${fileName}.png`;
            link.click();
        }
    }
}

window.addEventListener('load', () => generateQRCode());
regenerateBtn.addEventListener('click', () => generateQRCode());
saveBtn.addEventListener('click', saveQRCode);

window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        generateQRCode();
    } else if (event.key === 's' || event.key === 'S') {
        saveQRCode();
    }
});
