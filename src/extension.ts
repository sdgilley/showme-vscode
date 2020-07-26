// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getNotebookmd } from './getNotebookmd';
import { insertContentToEditor, findMe, getUrl } from './common';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "showme" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let insertNotebook = vscode.commands.registerCommand('showme.insertNotebook', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		} else {
			const getUserInput = vscode.window.showInputBox({
				prompt: 'Where is your notebook?',
			});
			getUserInput.then(val => {
				if (!val) {
					vscode.window.showInformationMessage('No notebook was found there.');
					return;
				}

				var url = val;

				var content = getNotebookmd(url);
				insertContentToEditor(editor, content, true);
			});

		}
	});
	context.subscriptions.push(insertNotebook);

	// Update the notebook - looks for nbstart and nbend.  If they are there, replace it with latest content
	let updateNotebook = vscode.commands.registerCommand('showme.updateNotebook', () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		} else {
			//find the path of the notebook from the <!-- nbstart line to the <!-- nbend line
			var pattern = '<!-- nbstart'
			var start = findMe(editor, pattern)
			pattern = '<!-- nbend'
			var end = findMe(editor, pattern)
			if (start > -1 && end > -1 && start < end) {
				//select all notebook code from start to end line
				editor.selection = new vscode.Selection(start, 0, end, 14)
				var url = getUrl(editor, start);
				var content = getNotebookmd(url);
				insertContentToEditor(editor, content, true)
			} else {
				vscode.window.showInformationMessage("There isn't a notebook to update in this document");

			}

		}
	});
	context.subscriptions.push(updateNotebook);
}

// this method is called when your extension is deactivated
export function deactivate() { }
