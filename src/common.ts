/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use-strict';

import * as vscode from 'vscode';

// delivers the markdown content to the editor
export async function insertContentToEditor(
	editor: vscode.TextEditor,
	content: string,
	overwrite: boolean = false,
	selection: vscode.Range = null!
) {
	if (selection == null) {
		selection = editor.selection;
	}

	try {
		if (overwrite) {
			await editor.edit(update => {
				update.replace(selection, content);
			});
		} else {
			// Gets the cursor position
			const position = editor.selection.active;

			await editor.edit(selected => {
				selected.insert(position, content);
			});
		}
	} catch (error) {
		vscode.window.showInformationMessage('Could not write content to active editor window: ' + error);
	}
}

// returns the line number that matches the pattern.
export function findMe(
    editor: vscode.TextEditor,
    pattern: string
) {
    var article = editor.document;
	var found = -1;

    for (var line = 0; line < article.lineCount; line++) {
        var text = article.lineAt(line).text;
        let match = text.match(pattern);
        if (match !== null && match.index !== undefined) {
            found = line;
            return found;
        }
    }
    return found;
}

// Returns URL from the nbstart line
export function getUrl(
    editor: vscode.TextEditor,
    start: number
) {
    var article = editor.document;
	var text = article.lineAt(start).text;
	var url = text.replace("<!-- nbstart ","");
	url = url.replace(" -->","");
    return url;
}