/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { unlinkSync, writeFileSync } from 'fs';
import fetch from "node-fetch";
import { convertToMarkdown, IResult } from './nbconvert';
import { resolve } from 'path';

function getConvertPromise(filePath: string) {
    return new Promise<IResult>((resolve, reject) => {
        convertToMarkdown(
            filePath,
            (result, error) => {
                if (error || result === null) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            }
        );
    });
}

export async function getNotebookmd(
    url: string,
    update: boolean
) {
    const ipynbJson = await getRawNotebookJson(url);
    const filePath = 'temp.ipynb';
    writeFileSync(filePath, ipynbJson);
    const fullPath = resolve(filePath);
    try {
        const result = await getConvertPromise(fullPath);
        if (result !== null) {
            return result.markdown;
        }

        return null;
    }
    finally {
        unlinkSync(fullPath);
    }



    // convert the input .ipynb notebook to .md
    // no error checking here yet...
    // get the notebook from user supplied url
    // then use nbconvert to create md
    // for now hard code the md
    // var nbmd = "";
    // if (update) {
    //     nbmd = "# This is the UPDATED notebook\n## Still only a test\nIf this was a real notebook we'd be much happier... but we have to start somewhere.\n\n```python\nprint(\"this is also a test\")\n```\n\nthis is also a test\n\n```python\nprint(5+6)\n```\n11"
    // } else {
    //     nbmd = "# This is a test\n## Only a test\nIf this was a real notebook we'd be much happier... but we have to start somewhere.\n\n```python\nprint(\"this is also a test\")\n```\n\nthis is also a test\n\n```python\nprint(5+6)\n```\n11"
    // }

    // // advance all the headings by one to make them fit better in the article... don't want two h1s!
    // nbmd = nbmd.replace(/(^|\r|\n|\r\n)#/g, "\n##");

    // // form a heading for the notebook with a link
    // var res = url.split("/");
    // var fname = res[res.length - 1];
    // var path = url.replace("raw.githubusercontent.com", "github.com");
    // path = path.replace("/master", "/blob/master");
    // var firstline = '> [!TIP] \n> Contents of _' + fname + '_. **[Open in GitHub]('  + path + ')**.';

    // // add start and end tags so we can recognize this as a notebook when we want to update
    // var content = "<!-- nbstart " + url + " -->\n" + firstline + "\n" + nbmd + "\n<!-- nbend -->";
    // return content;




}

async function getRawNotebookJson(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();

    return JSON.stringify(data);
}