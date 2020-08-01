import * as os from 'os';
import { spawn, execSync } from 'child_process';
import { resolve, join } from 'path';

export interface IResult {
    markdown: string;
}

export function convertToMarkdown(
    ipynbJson: string,
    callback: (result: IResult | null, errorOrNull: Error | null) => void) {

    const args: string[] = [
        'nbconvert',
        '--to',
        'markdown',
        '--stdin',
        '--stdout'
    ];

    let result: IResult | null = null;
    const plat = os.platform();
    const stdout = execSync(`${plat === 'win32' ? 'where' : 'which'} jupyter`).toString();
    const jupyterPath = stdout.split('\r\n')[0].substr(0, stdout.length - 1);
    const path = resolve(jupyterPath);
    const nbConvert = spawn(path, args, { windowsVerbatimArguments: true });

    nbConvert.stdin.write(`${ipynbJson}`); 
    nbConvert.stdout.on('data', data => {
        result = { markdown: data + '' };
    });
    nbConvert.stdin.end();

    nbConvert.on('error', err => {
        callback(null, err);
    });

    nbConvert.on('exit', (code, _) => {
        if (code !== 0) {
            callback(null, {
                name: "FileSystemError",
                message: `Unable to convert to markdown - error code: ${code}`
            });
        } else {
            console.log('got the result');
            callback(result, null);
        }
    });
}