const fileInput = document.getElementById('fileInput');
const asciiArt = document.getElementById('art');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

async function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const channels = 4;

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

async function update() {
    const base64 = await toBase64(fileInput.files[0]);

    const src = base64;

    const img = new Image();
    img.onload = () => {
        canvas.width = img.width/img.height*100;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        convert();
    }
    img.src = src;
}

// const characters = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const characters = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~i!lI;:,"^`\'. ';

async function convert() {
	const charArr = characters.split('').reverse();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let res = '';

    for (let i = 0; i < canvas.width*canvas.height*channels; i += channels) {
        if (i % (canvas.width * channels) == 0 && i != 0) res += '\n';
        let luminance = 0.2126*imageData.data[i] + 0.7152*imageData.data[i+1] + 0.0722*imageData.data[i+2];
        res += `<span style="color: ${rgbToHex(imageData.data[i], imageData.data[i+1], imageData.data[i+2])}">${charArr[Math.floor(luminance / (255 / charArr.length))]}</span>`;
        // res += charArr[Math.floor(luminance / (255 / charArr.length))];
    }

    // asciiArt.innerText = res;
    asciiArt.innerHTML = res;
}