import fs from "node:fs";
import { parse } from "csv-parse";

export async function readCsvFile(entity) {
  const csvFilePath = new URL(`../../${entity}.csv`, import.meta.url);

  const parseStream = fs
    .createReadStream(csvFilePath, { encoding: "utf-8" })
    .pipe(parse({ delimiter: "," }));

  let currentLine = 1;
  let entityProperties = {};
  for await (const line of parseStream) {
    if (currentLine === 1) {
      entityProperties = line.reduce(
        (entity, property) => ({ ...entity, [property]: "" }),
        {}
      );
    } else {
      entityProperties = line.reduce(
        (entity, property, index) => ({
          ...entity,
          [Object.keys(entityProperties)[index]]: property,
        }),
        entityProperties
      );

      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetch(`http://localhost:3333/${entity}`, {
        method: "POST",
        body: JSON.stringify(entityProperties),
      })
        .then((response) => (!response.ok ? response.json() : null))
        .then((data) => console.log(data ?? "ok!"))
        .catch((err) => console.log(err));
    }
    currentLine++;
  }
}
