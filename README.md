# Show Me the Notebook
Hackathon 2020 - insert the markdown version of a Jupyter notebook into a document

There are two functions:

* **Show me the notebook!** - you enter the location of the notebook, and a markdown version of it is added to the document starting at the position of your cursor.  Make sure that it starts on a new line.  Also do not modify the start or end tags; it's what the next function uses to update the notebook.  
* **Update the notebook** - If there is a notebook in the document (determined by searching for the start and end tags), this function will read the url in the start tag, re-read the notebook and replace the contents between start and end with the latest version.  If you insert multiple notebooks in the same document (why would you do that?) only the first one will be updated.

## Instructions

Use `npm install` to install dependencies.

* Open in VS Code
* **F5** to run
* Use Ctrl-Shift-P in new window
* Select **Jupyter: Show me the notebook!** then input the path to your notebook.
* select **Jupyter: Update the notebook** to update a notebook already on the page.


### Left to do

Right now everything is in place for this to work, but with a hardcoded result. That is, nothing is read or converted yet.  But all the scaffolding is in place.  Next to do:

* Figure out how to actually open the .json notebook from a github url
* Figure out how to run nbconvert on the json input to get the markdown.  Or another possibility I suppose is to iterate through the .json directly and create the markdown?  


**Enjoy!**
