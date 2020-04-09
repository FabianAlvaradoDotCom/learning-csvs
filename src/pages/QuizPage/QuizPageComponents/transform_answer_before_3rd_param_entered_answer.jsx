const transformAnswerForComparison = (answer, answer_type) => {
  //
  //


  // Function that trims and remove innecessary spaces
  const cleanSpace= (val, type) => {   

    /*// Before other cleaning, we get rid of particular visual elements so they do not interfere with actual content

    val = val.replace(new RegExp(['<b>'],"g"), " ");
    val = val.replace(new RegExp(['</b>'],"g"), " ");

    val = val.replace(new RegExp(['<code>'],"g"), " ");
    val = val.replace(new RegExp(['</code>'],"g"), " ");

    val = val.replace(new RegExp(['<code>'],"g"), " ");
    val = val.replace(new RegExp(['</code>'],"g"), " ");//*/

    // This will replace ASCII 'tab' spacing to a regular single space. Tab spacing size varies as it is meant for aligning the lines vertically.
    val = val.replace(new RegExp(['&#09;'],"g"), " ");

    // These 2 represent the same value, the &emsp; is how it looks in html, but the whitespace is not a regular whitespace, it is how an emsp is represented inside a textarea, so I needed to get this in order to be able to compare the data entered to the textarea.
    val = val.replace(new RegExp(['&emsp;'],"g"), " ");
    val = val.replace(new RegExp([" "],"g"), " ");
    
    if (type !== 'code-type') {
      val = val.replace(/<br>/g, ' '); // Converts breaklines to spaces
      val = val.replace(/<br\/>/g, ' '); // Converts breaklines to spaces

      // Before other cleaning, we get rid of particular visual elements so they do not interfere with actual content      

      val = val.replace(new RegExp(['<code>'],"g"), " ");
      val = val.replace(new RegExp(['</code>'],"g"), " ");

      val = val.replace(new RegExp(['<pre>'],"g"), " ");
      val = val.replace(new RegExp(['</pre>'],"g"), " ");//*/
    }


    // We will need to remove this from code or plain text content, as teh answers may have <b> to highlight portions on code answers
    val = val.replace(new RegExp(['<b>'],"g"), " ");
    val = val.replace(new RegExp(['</b>'],"g"), " ");   

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

    /*val = val.replace(/\< /g, '<');
    val = val.replace(/ \</g, '<');

    val = val.replace(/\> /g, '>');
    val = val.replace(/ \>/g, '>');*/

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