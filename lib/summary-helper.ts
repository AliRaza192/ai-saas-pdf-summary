export const parseSection = (
  section: string
): { title: string; points: string[] } => {
  const [title, ...content] = section.split("\n");

  const cleanTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();

  const points: string[] = [];

  // Handle both '-' and '•' bullet points
  content.forEach((line) => {
    const trimmedLine = line.trim();
    // Check for bullet points (either - or •)
    if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
      points.push(trimmedLine.substring(1).trim());
    }
    // Also include non-empty lines that aren't bullet points
    else if (
      trimmedLine &&
      !trimmedLine.startsWith("#") &&
      !trimmedLine.startsWith("[Choose")
    ) {
      if (points.length > 0) {
        // Append to last point if there are existing points
        points[points.length - 1] += " " + trimmedLine;
      } else {
        // Or create a new point if none exist
        points.push(trimmedLine);
      }
    }
  });

  return {
    title: cleanTitle,
    points: points.filter((point) => point.trim().length > 0),
  };
};

export function parsePoint(point: string) {
  const isNumbered = /^\d+\./.test(point);
  const isMainPoint = /^./.test(point);

  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();

  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

export function parseEmojiPoint(content: string) {
  const cleanContent = content.replace(/^[•]\s*/, "").trim();

  // const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  const matches = cleanContent.match(/^([\u231A-\uD83E\uDDFF]+)(.*)$/u);

  if (!matches) return null;

  const [_, emoji, text] = matches;
  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}

// export const parseSection = (section: string): { title: string; points: string[] } => {
//   const [title, ...content] = section.split('\n');

//   const cleanTitle = title.startsWith('#')
//     ? title.substring(1).trim()
//     : title.trim();

//   const points: String[] = [];

//   let currentPoint = '';

//   content.forEach((line) => {
//     const trimmedLine = line.trim();
//     if (trimmedLine.startsWith("•")) {
//       if (currentPoint) points.push(currentPoint.trim());
//       currentPoint = trimmedLine;
//     } else if (!trimmedLine) {
//       if (currentPoint) points.push(currentPoint.trim());
//       currentPoint = '';
//     } else {
//       currentPoint += ' ' + trimmedLine;
//     }
//   });

//   if (currentPoint) points.push(currentPoint.trim());

//   return {
//     title: cleanTitle,
//     points: points.filter(
//       (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
//     ) as string[],
//   };
// };
