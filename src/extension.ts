// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getNotebookAsMarkdown } from './getNotebookmd';
import { insertContentToEditor, findMe, getUrl } from './common';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // TODO: check for pandoc being installed on local machine
    // if not installed, prompt user to install

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "showme" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    let insertNotebook = vscode.commands.registerCommand('showme.insertNotebook', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        } else {
            const value = await vscode.window.showInputBox({
                prompt: 'Where is your notebook? (enter URL to raw GitHub file)',
            });

            if (!value) {
                vscode.window.showInformationMessage("You didn't enter a URL");
                return;
            }

            var url = value;
            var content = await getNotebookAsMarkdown(url, false);
            if (content !== null) {
                insertContentToEditor(editor, content, true);
            }
        }
    });
    context.subscriptions.push(insertNotebook);

    // Update the notebook - looks for nbstart and nbend.  If they are there, replace it with latest content
    let updateNotebook = vscode.commands.registerCommand('showme.updateNotebook', async () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        } else {
            //find the path of the notebook from the <!-- nbstart line to the <!-- nbend line
            var pattern = '<!-- nbstart';
            var start = findMe(editor, pattern);
            pattern = '<!-- nbend';
            var end = findMe(editor, pattern);

            if (start > -1 && end > -1 && start < end) {
                //select all notebook code from start to end line
                editor.selection = new vscode.Selection(start, 0, end, 14);
                var url = getUrl(editor, start);
                var content = await getNotebookAsMarkdown(url, true);
                if (content) {
                    insertContentToEditor(editor, content, true);
                }
            } else {
                vscode.window.showInformationMessage("There isn't a notebook to update in this document");

            }

        }
    });
    context.subscriptions.push(updateNotebook);
}

// this method is called when your extension is deactivated
export function deactivate() { }
