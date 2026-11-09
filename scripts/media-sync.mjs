import { readdir, copyFile, mkdir, writeFile, rm } from 'node:fs/promises';
const source = new URL('../media/', import.meta.url);
const target = new URL('../public/videos/', import.meta.url);
const files = (await readdir(source)).filter(f => /\.(mp4|webm|mov|jpe?g|png|webp|gif|avif)$/i.test(f)).sort();
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const items = [];
for (const [i, file] of files.entries()) {
 const name = `media-${i + 1}.${file.split('.').pop().toLowerCase()}`;
 await copyFile(new URL(encodeURIComponent(file), source), new URL(name, target));
 items.push({ type: /\.(mp4|webm|mov)$/i.test(file) ? 'video' : 'image', src: 'videos/' + name });
}
await writeFile(new URL('../src/config/media.ts', import.meta.url), 'export interface MediaItem { type: "video" | "image"; src: string }\nexport const media: MediaItem[] = ' + JSON.stringify(items, null, 2) + ';\n');
console.log(`Готово: ${items.length} фото и видео.`);
