const transformAnswerForComparison = (answer, answer_type, source) => {
  //
  
  // Function that trims and remove innecessary spaces
  const cleanSpace= (val, type) => {
















    
    // First I need to remove sny comments given in the answer question so we do not need to type them

    while(val.search('<span class="comments">') !== -1){
      if(val.search('</span>') !== -1){
        let comments_to_remove = val.substring(val.search('<span class="comments">'),val.search('</span>') + 7);
        val = val.replace(comments_to_remove, ' ');
      }
    }

    while(val.search('<span class=\'comments\'>') !== -1){
      if(val.search('</span>') !== -1){
        let comments_to_remove = val.substring(val.search('<span class=\'comments\'>'),val.search('</span>') + 7);
        val = val.replace(comments_to_remove, ' ');
      }
    }



















    // This will replace ASCII 'tab' spacing to a regular single space. Tab spacing size varies as it is meant for aligning the lines vertically.
    val = val.replace(new RegExp(['&#09;'],"g"), " ");

    // These 2 represent the same value, the &emsp; is how it looks in html, but the whitespace is not a regular whitespace, it is how an emsp is represented inside a textarea, so I needed to get this in order to be able to compare the data entered to the textarea.
    val = val.replace(new RegExp(['&emsp;'],"g"), " ");
    val = val.replace(new RegExp([" "],"g"), " ");

    // This will give the user the option to write or not the semicolon after a curly bracket
    val = val.replace(new RegExp(["};"],"g"), "}");
    

    // WE NEED TO MAKE SURE THAT THIS IS REMOVED ONLY FROM THE RECORDED ANSWERS IN THE DB, as the answers may have <b> to highlight portions on code answers, but THE USER SHOULD STILL BE ABLE TO ENTER THESE CHARACTERS.
    if (source === "database-entered") {
      val = val.replace(/<br>/g, ' '); // Converts breaklines to spaces
      val = val.replace(/<br\/>/g, ' '); // Converts breaklines to spaces

      // Before other cleaning, we get rid of particular visual elements so they do not interfere with actual content
/*
      val = val.replace(new RegExp(['<span class="comments">|<span class=\'comments\'>'],"g"), " ");
      //val = val.replace(new RegExp(["<span id='comments'>"],"g"), " ");
      val = val.replace(new RegExp(['</span>'],"g"), " ");

*/
      


























      /* Replacing this code by an space couls cause isssues when the elements are inside a quoted string, I will replace by nothing in order to test if works
      val = val.replace(new RegExp(['<code>'],"g"), " ");
      val = val.replace(new RegExp(['</code>'],"g"), " ");

      val = val.replace(new RegExp(['<pre>'],"g"), " ");
      val = val.replace(new RegExp(['</pre>'],"g"), " ");

      val = val.replace(new RegExp(['<b>'],"g"), " ");
      val = val.replace(new RegExp(['</b>'],"g"), " ");
      */

      val = val.replace(new RegExp(['<code>'],"g"), "");
      val = val.replace(new RegExp(['</code>'],"g"), "");

      val = val.replace(new RegExp(['<pre>'],"g"), "");
      val = val.replace(new RegExp(['</pre>'],"g"), "");

      val = val.replace(new RegExp(['<b>'],"g"), "");



      val = val.replace(new RegExp(['<b class="magenta">|<b class=\'magenta\'>'],"g"), "");
      val = val.replace(new RegExp(['<b class="green">|<b class=\'green\'>'],"g"), "");
      val = val.replace(new RegExp(['<b class="red">|<b class=\'red\'>'],"g"), "");
      val = val.replace(new RegExp(['<b class="blue">|<b class=\'blue\'>'],"g"), "");
      val = val.replace(new RegExp(['<b class="white">|<b class=\'white\'>'],"g"), "");
      val = val.replace(new RegExp(['<b class="string">|<b class=\'string\'>'],"g"), "");
      



      val = val.replace(new RegExp(['</b>'],"g"), "");
    }




























    
    // Since some of the just removed elements could have been at the end or begining of the string, and as they were replaced by a space: " ", we will get rid of those extra spaces:
    val = val.trim();  // Removing initial and end spaces

    val = val.replace(/\r?\n|\r/g, ' '); // Converts breaklines to spaces
    val = val.replace(/\t/g, ' '); // Converts tabs to spaces
    val = val.replace(/               /g, ' '); // Converts multi-spaces to single-spaces
    val = val.replace(/              /g, ' ');
    val = val.replace(/             /g, ' ');
    val = val.replace(/            /g, ' ');
    val = val.replace(/           /g, ' ');
    val = val.replace(/          /g, ' ');
    val = val.replace(/         /g, ' ');
    val = val.replace(/        /g, ' ');
    val = val.replace(/       /g, ' ');
    val = val.replace(/      /g, ' ');
    val = val.replace(/     /g, ' ');
    val = val.replace(/    /g, ' ');
    val = val.replace(/   /g, ' ');
    val = val.replace(/  /g, ' ');
    val = val.replace(/ \(/g, '('); // Removes the spaces before and after left and right parenthesis and curly braces
    val = val.replace(/ \)/g, ')');
    val = val.replace(/\( /g, '(');
    val = val.replace(/\) /g, ')');
    val = val.replace(/ \{/g, '{');
    val = val.replace(/ \}/g, '}');
    val = val.replace(/\{ /g, '{');
    val = val.replace(/\} /g, '}');

    val = val.replace(/\, /g, ',');
    val = val.replace(/ \,/g, ',');

    val = val.replace(/\: /g, ':');
    val = val.replace(/ \:/g, ':');

    val = val.replace(/\; /g, ';');
    val = val.replace(/ \;/g, ';');

    val = val.replace(/\+ /g, '+');
    val = val.replace(/ \+/g, '+');

    val = val.replace(/\* /g, '*');
    val = val.replace(/ \*/g, '*');

    val = val.replace(/\- /g, '-');
    val = val.replace(/ \-/g, '-');

    val = val.replace(/\% /g, '%');
    val = val.replace(/ \%/g, '%');

    val = val.replace(/\& /g, '&');
    val = val.replace(/ \&/g, '&');

    val = val.replace(/\| /g, '|');
    val = val.replace(/ \|/g, '|');

    val = val.replace(new RegExp(['< '],"g"), "&lt;");
    val = val.replace(new RegExp([' <'],"g"), "&lt;");

    val = val.replace(new RegExp(['> '],"g"), "&gt;");
    val = val.replace(new RegExp([' >'],"g"), "&gt;");

    val = val.replace(new RegExp(['<'],"g"), "&lt;");

    val = val.replace(new RegExp(['>'],"g"), "&gt;");
  
    val = val.replace(/\[ /g, '[');
    val = val.replace(/ \[/g, '[');

    val = val.replace(/\] /g, ']');
    val = val.replace(/ \]/g, ']');

    val = val.replace(/\= /g, '=');
    val = val.replace(/ \=/g, '=');

    val = val.replace(/\. /g, '.');
    val = val.replace(/ \./g, '.');


















    val = val.replace(/\/ /g, '/');
    val = val.replace(/ \//g, '/'); 
    
    val = val.replace(/\\ /g, '\\');
    val = val.replace(/ \\/g, '\\');    
















    return val;
  }

  // Formatting and removing unnecessary words
  const formattingAnswer = (val, contType) => {
    // If the answer is set to text type, it converts all to lowercase, not if it is code
    if (contType != 'code-type') {
      if (val === undefined) {
        return '';
      } else {
        val = val.toLowerCase();
        val = val.replace(/ and /g, ' '); // --------------------------------Replacing " and " by "" for better text validation
        val = val.replace(/\,/g, ''); // --------------------------------Deleting commas for better text validation
        val = val.replace(/\./g, ''); // --------------------------------Deleting periods for better text validation
        return val;
      }
    } else {
      if (val === undefined) {
        return '';
      } else {
        if (val.split("'").length % 2 == 1) {
          // Making that the validation of code accepts single of double quotes pairs, but not alone quoting
          val = val.replace(/\'/g, '"');
        }
        return val;
      }
    }
  }

  let cleaned = cleanSpace(answer, answer_type);

  let formatted = formattingAnswer(cleaned, answer_type);

  // Splitting into an array to be able to compare word vs word, this way we ensure that there are complete words and prevent allowing strange words
  let converted_into_array = formatted.split(' ');

  return converted_into_array;
};

export default transformAnswerForComparison;