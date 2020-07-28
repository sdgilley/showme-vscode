import { spawn, execSync, ExecException } from 'child_process';
import { resolve, join } from 'path';

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
    const stdout = execSync('which python').toString();
    const pythonPath = stdout.substr(0, stdout.length - 1);
    const jupyterPath = join(pythonPath, 'scripts/jupiter');

    const path = resolve(jupyterPath);
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