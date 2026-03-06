import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const rootDir = path.resolve(__dirname, "../../");
export const createUserView = async (name: string) => {
  const html = `
    <!doctype html>
       <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
    <%- html %>
    </body>
    </html>
    `;
  await fs.writeFile(path.join(rootDir, "views", `${name}.ejs`), html);
};
