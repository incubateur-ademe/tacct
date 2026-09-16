import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = join(process.cwd(), 'public', 'notion-images');

export async function downloadNotionImage(
  url: string,
  blockId: string
): Promise<string> {
  if (!url) return '';

  try {
    const ext = url.includes('.png')
      ? 'png'
      : url.includes('.jpg') || url.includes('.jpeg')
        ? 'jpg'
        : 'webp';
    const filename = `${blockId}.${ext}`;
    const filepath = join(PUBLIC_DIR, filename);
    const publicPath = `/notion-images/${filename}`;

    if (existsSync(filepath)) {
      return publicPath;
    }

    if (!existsSync(PUBLIC_DIR)) {
      mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Failed to download image: ${url} - Status: ${response.status}`
      );
      return url;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    writeFileSync(filepath, buffer);

    return publicPath;
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error);
    return url;
  }
}
