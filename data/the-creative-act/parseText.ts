import * as fs from 'fs';

interface Chapter {
  title: string;
  lineNumber: number;
}

interface Paragraph {
  text: string;
  id: number; // increase by 1 for each preceding paragraph
  chapterTitle: string;
}

function findChapterLocations(
  filePath: string,
  chapterTitles: string[]
): Chapter[] {
  const locations: Chapter[] = [];
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

  for (let i = 0; i < lines.length - 3; i++) {
    for (const chapter of chapterTitles) {
      // chapter pattern can be identified as `{chapterTitle}\n\n\n©`
      if (
        lines[i].trim() === chapter &&
        lines[i + 1] === '' &&
        lines[i + 2] === '' &&
        lines[i + 3].trim() === '©'
      ) {
        locations.push({
          title: chapter,
          lineNumber: i + 1
        });
      }
    }
  }

  return locations;
}

function getChapterFromLine(lineNumber: number, chapterLocations: Chapter[]): Chapter {
  for (let i = 0; i < chapterLocations.length - 1; i++) {
    if (lineNumber < chapterLocations[i + 1].lineNumber) {
      return chapterLocations[i]
    }
  }
  return chapterLocations[chapterLocations.length - 1]
}

function findParagraphs(filePath: string, chapterLocations: Chapter[]): Paragraph[] {
  // currently just consider a paragraph as consecutive (no whitespace inbetween) lines where the starting line starts with a capital letter and the ending line ends with a period
  const paragraphs: Paragraph[] = []
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

  let id = 1
  for (let i = 0; i < lines.length; i++) {

    if (lines[i] === '' || (lines[i][0] && lines[i][0] != lines[i][0].toUpperCase())) {
      continue;
    }
    let isValidParagraph = false;
    let j = i;
    while (j < lines.length - 1) {
      // if line doesn't end with period and the next line is empty, break and is not valid pargraph
      // if line doesn't end with period and the next line is not empty, continue 
      // if line ends with period and the next line is not empty, continue
      // if line ends with period and the next line is empty, break and is valid paragaraph
      const lineEndsWithPeriod = lines[j][lines[j].length - 1] === '.'
      const nextLineIsEmpty = lines[j + 1] === ''
      if (lineEndsWithPeriod) {
        if (nextLineIsEmpty) {
          break;
        } else {
          j++;
          continue;
        }
      } else {
        if (nextLineIsEmpty) {
          isValidParagraph = true;
          break;
        } else {
          j++;
          continue;
        }
      }
    }
    if (!isValidParagraph) {
      continue;
    }

    let text = "";
    for (let k = i; k < j + 1; k++) {
      text += lines[k].trimStart().trimEnd() + " "
    }
    text = text.trimEnd()
    if (text === '©') {
      //TODO: why does this happen?
      continue;
    }
    const chapter = getChapterFromLine(i, chapterLocations);

    const paragraph: Paragraph = {
      text,
      id,
      chapterTitle: chapter.title,
    }
    id++;
    paragraphs.push(paragraph)
  }
  return paragraphs
}


function main() {
  try {
    const filePath = process.argv[2];
    const chaptersFile = process.argv[3];

    if (!filePath || !chaptersFile) {
      throw new Error('Please provide input file path and chapters file path as arguments');
    }

    // Read chapter titles from file
    const chapterTitles = fs.readFileSync(chaptersFile, 'utf-8')
      .split('\n')
      .filter(line => line.trim() !== '');

    const chapterLocations: Chapter[] = findChapterLocations(filePath, chapterTitles);
    const paragraphs: Paragraph[] = findParagraphs(filePath, chapterLocations)

    const chapterLocationsOutputPath = 'chapter_locations.json';
    fs.writeFileSync(chapterLocationsOutputPath, JSON.stringify(chapterLocations, null, 2));
    console.log(`Chapter locations written to ${chapterLocationsOutputPath}. Wrote ${chapterLocations.length} chapter locations`);


    const paragraphsOutputPath = 'paragraphs.json';
    fs.writeFileSync(paragraphsOutputPath, JSON.stringify(paragraphs, null, 2));
    console.log(`Paragraphs written to ${paragraphsOutputPath}. Wrote ${paragraphs.length} paragraphs`);


  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
