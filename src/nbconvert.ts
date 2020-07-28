import { spawn, exec, ExecException } from 'child_process';
import { resolve } from 'path';

export interface IResult {
    markdown: string;
}

export function convertToMarkdown(
    ipynbPath: string,
    callback: (result: IResult | null, errorOrNull: Error | null) => void) {
    //exec('which jupyter nbconvert', (err: ExecException | null, stdout: string, stderr: string) => {
    // if (err) {
    //     callback(null, err);
    // }

    // if (!stdout) {
    //     throw new Error('Cannot find nbconvert - is it installed?');
    // }

    //const nbConvertPath = stdout.substr(0, stdout.length - 1);
    const args = [];
    args.push('nbconvert', '--to', 'markdown', `"${ipynbPath}"`, '--stdout');

    let result: IResult | null = null;
    const path = resolve('C:\\Users\\dapine\\AppData\\Local\\Programs\\Python\\Python38-32\\Scripts\\jupyter');
    let nbConvert = spawn(path, args);
    nbConvert.stdout.on('data', data => {
        result = { markdown: data + '' };
    });

    nbConvert.on('error', (err) => {
        callback(null, err);
    });

    nbConvert.on('exit', (code, _) => {
        if (code !== 0) {
            callback(null, { name: "UnableToConvertError", message: `Exited with error code: ${code}.` });
        } else {
            callback(result, null);
        }
    });
    //});
}