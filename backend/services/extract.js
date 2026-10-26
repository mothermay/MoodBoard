import fs from "fs/promises";
import path from "path";
import JSZip from "jszip";
import xml2js from "xml2js";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

function clean(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/[^\S\r\n]{3,}/g, " ")
    .trim()
    .slice(0, 30000);
}

async function pptxText(filePath) {
  const data = await fs.readFile(filePath);
  const zip = await JSZip.loadAsync(data);
  const slideNames = Object.keys(zip.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  let out = "";
  for (const name of slideNames) {
    const xml = await zip.files[name].async("text");
    const parsed = await xml2js.parseStringPromise(xml);
    const texts = [];
    const walk = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return node.forEach(walk);
      for (const [key, value] of Object.entries(node)) {
        if (key.endsWith(":t") || key === "a:t") {
          if (Array.isArray(value)) texts.push(...value.filter(v => typeof v === "string"));
        } else walk(value);
      }
    };
    walk(parsed);
    out += texts.join(" ") + "\n";
  }
  return clean(out);
}

export async function extractText(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();

  if (mimetype === "application/pdf" || ext === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdfParse(buffer);
    return clean(parsed.text);
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === ".docx"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return clean(result.value);
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    mimetype === "application/vnd.ms-powerpoint" ||
    ext === ".pptx" || ext === ".ppt"
  ) {
    if (ext === ".ppt") {
      throw new Error("Legacy .ppt files are not supported for text extraction. Please save as .pptx.");
    }
    return await pptxText(filePath);
  }

  throw new Error("Unsupported document type.");
}
