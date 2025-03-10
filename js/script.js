const qrCodeElement = document.getElementById('qrcode');
const qrTextElement = document.getElementById('qr-text');
const historyElement = document.getElementById('history');
const regenerateBtn = document.getElementById('regenerate-btn');
const saveBtn = document.getElementById('save-btn');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(x => characters[x % characters.length])
        .join('');
}

function generateQRCode(text) {
    qrCodeElement.innerHTML = '';
    const randomString = text || generateRandomString(32);
    qrTextElement.textContent = randomString;

    new QRCode(qrCodeElement, {
        text: randomString,
        width: 200,
        height: 200
    });

    if (!text) {
        const listItem = document.createElement('li');
        listItem.textContent = randomString;
        listItem.addEventListener('click', () => generateQRCode(randomString));
        historyElement.insertBefore(listItem, historyElement.firstChild);
    }
}

function saveQRCode() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
        // 余白付きキャンバスを作成
        const padding = 20;
        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");

        // 新しいキャンバスのサイズを計算
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;

        // 白背景を描画
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

        // 元のQRコードを中央に描画
        ctx.drawImage(canvas, padding, padding);

        // 保存処理
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
