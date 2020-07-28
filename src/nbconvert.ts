import { spawn, exec, ExecException } from 'child_process';
import { resolve } from 'path';

export interface IResult {
    markdown: string;
}

export function convertToMarkdown(
    ipynbPath: string,
    callback: (result: IResult | null, errorOrNull: Error | null) => void) {

    const args: string[] = [
        'nbconvert',
        '--to',
        'markdown',
        `"${ipynbPath}"`,
        '--stdout'
    ];

    let result: IResult | null = null;
    const path = resolve('C:\\Users\\sgilley\\AppData\\Local\\Programs\\Python\\Python37\\Scripts\\jupyter');
    let nbConvert = spawn(path, args, { windowsVerbatimArguments: true });
    nbConvert.stdout.on('data', data => {
        result = { markdown: data + '' };
    });

    nbConvert.on('error', err => {
        callback(null, err);
    });

    nbConvert.on('exit', (code, _) => {
        if (code !== 0) {
           callback(null, { name: "UnableToConvertError", message: `Exited with error code: ${code}.` });
        } else {
            callback(result, null);
        }
    });
}