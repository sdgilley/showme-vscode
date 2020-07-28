import * as os from 'os';
import { spawn, execSync } from 'child_process';
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
    const plat = os.platform();
    const stdout = execSync(`${(plat === 'win32' ? 'where' : 'which')} python`).toString();

    let pythonPath = stdout.split('\r\n')[0].substr(0, stdout.length - 1);
    pythonPath = pythonPath.replace('python.exe', '');

    const jupyterPath = join(pythonPath, 'Scripts/jupyter');

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
            callback(null, {
                name: "FileSystemError",
                message: `Unable to convert "${ipynbPath}" to markdown - error code: ${code}`
            });
        } else {
            callback(result, null);
        }
    });
}