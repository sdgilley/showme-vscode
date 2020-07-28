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
            return createFinalContent(result.markdown, url);
        }

        return null;
    }
    finally {
        unlinkSync(fullPath);
    }


async function getRawNotebookJson(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json();

    return JSON.stringify(data);
}

// add start/end and a note before the notebook content
function createFinalContent (content: string, url: string) {

    // advance all the headings by one to make them fit better in the article... don't want two h1s!
    // content = content.replace(/(^|\r|\n|\r\n)#/g, "\n##");

    // form a heading for the notebook with a link
    
    var res = url.split("/");
    var fname = res[res.length - 1];
    var path = url.replace("raw.githubusercontent.com", "github.com");
    path = path.replace("/master", "/blob/master");
    var firstline = '> [!TIP] \n> Contents of _' + fname + '_. **[Open in GitHub]('  + path + ')**.';

    // add start and end tags so we can recognize this as a notebook when we want to update
    content = "<!-- nbstart " + url + " -->\n" + firstline + "\n" + content + "\n<!-- nbend -->";
    return content;

}}