/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use-strict';

export function getNotebookmd(
    url: string
) {
    // convert the input .ipynb notebook to .md
    // no error checking here yet...
    // get the notebook from user supplied url
    // then use nbconvert to create md

    // for now hard code the md
    var nbmd = "# This is a test\n## Only a test\nIf this was a real notebook we'd be much happier... but we have to start somewhere.\n\n```python\nprint(\"this is also a test\")\n```\n\nthis is also a test\n\n```python\nprint(5+6)\n```\n11"

    // advance all the headings by one to make them fit better in the article... don't want two h1s!
    nbmd = nbmd.replace(/(^|\r|\n|\r\n)#/g, "\n##");

    // add start and end tags so we can recognize this as a notebook when we want to update
    var content = "<!-- nbstart " + url + " --> \n" + nbmd + "\n<!-- nbend --> ";
    return content;

}