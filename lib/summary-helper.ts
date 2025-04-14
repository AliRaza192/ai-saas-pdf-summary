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
