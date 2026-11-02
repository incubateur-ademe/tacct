export const parsePostgresArray = (pgArray: string | null): string[] => {
  if (!pgArray || pgArray === '{}') return [];
  const content = pgArray.slice(1, -1);
  if (!content) return [];
  const items: string[] = [];
  let currentItem = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      items.push(currentItem.trim());
      currentItem = '';
    } else {
      currentItem += char;
    }
  }
  if (currentItem) {
    items.push(currentItem.trim());
  }
  return items;
};
