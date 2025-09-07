require('dotenv').config();
const https = require("https");
const express = require("express");
const fileUpload = require("express-fileupload");
const ImageKit = require("imagekit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).json({ error: "Файл не обрано" });

    const file = req.files.file;
    const result = await imagekit.upload({ file: file.data, fileName: file.name, folder: "/lessons" });

    res.json({ url: result.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка завантаження" });
  }
});

function pingGoogle() {
  https.get("https://www.google.com", (res) => {
    console.log(`[${new Date().toISOString()}] Status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  });
}

// Викликаємо відразу при старті
pingGoogle();

// Потім кожні 5 хвилин (300000 мс)
setInterval(pingGoogle, 5 * 60 * 1000);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
