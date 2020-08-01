/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { unlinkSync, writeFileSync } from 'fs';
import fetch from "node-fetch";
import { convertToMarkdown, IResult } from './nbconvert';
import { resolve, join } from 'path';
import { tmpdir } from 'os';

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

export async function getNotebookAsMarkdown(
    url: string,
    update: boolean
) {
    url = toRaw(url);
    const ipynbJson = await getRawNotebookJson(url);
    const filePath = join(tmpdir(),'temp.ipynb');
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
    function createFinalContent(content: string, url: string) {

        // advance all the headings by one to make them fit better in the article... don't want two h1s!
        //content = content.replace(/(^|\r|\n|\r\n)#/g, "\n##");

        let path = toUrl(url);
        var res = url.split("/");
        var fname = res[res.length - 1];
        var firstline = '> [!TIP] \n> Contents of _' + fname + '_. **[Open in GitHub](' + path + ')**.';

        // add start and end tags so we can recognize this as a notebook when we want to update
        content = "\n<!-- nbstart " + url + " -->\n" + firstline + "\n\n" + content + "\n<!-- nbend -->";
        return content;

    }
}

function toRaw(url: string) {
    // use this to make sure your url is to the raw file
    let raw = '';
    var res = url.split("/");

    // change the path from raw.githubusercontent.com to github.com
    if (res[2] === "github.com") {
        res[2] = "raw.githubusercontent.com";

        // re-form the string 
        for (let i = 0; i < res.length - 1; i++) {
            raw = raw + res[i] + '/';
        }

        // add filename without the / at the end
        raw = raw + res[res.length - 1];
        raw = raw.replace("/blob", "");
    } else {
        // return original value, it already is a raw url
        raw = url;
    }
    return raw;
}


function toUrl(raw: string) {
    // use this to make sure your url is to the original (non-raw) file
    var res = raw.split("/");
    let url = '';

    // change the path from github.com to raw.githubusercontent.com 
    if (res[2] === "raw.githubusercontent.com") {
        res[2] = "github.com";
        // add blob after the branch
        res[5] = "/blob/" + res[5];
        // re-form the string 
        for (let i = 0; i < res.length - 1; i++) {
            url = url + res[i] + '/';
        }
        // add filename without the / at the end

        url = url + res[res.length - 1];
    } else {
        // return original value, it wasn't the raw url after all
        url = raw;
    }
    return url;
}