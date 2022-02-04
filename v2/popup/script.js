console.log("Pop Up Script Started...")

// Quering Chrome Tabs to see which one is currently open
// Sending command to content.js to prepare a Summary
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getSummary"}, function(summary) {
        console.log(summary);
        if (summary){
            updatePopUp(summary);
        }
    });
});

function updatePopUp(summary) {
    console.log('Updating Pop Up...');
    // get elements from index.html
    var source = document.getElementById("source");
    var title = document.getElementById("title");
    var date = document.getElementById("date");
    var author = document.getElementById("author");
    var bench = document.getElementById("bench");
    var citation = document.getElementById("citation");

    // Update the values of respective elements with the summary
    source.innerHTML = "Source: "+summary.source;
    title.innerHTML =  "Title: "+summary.title;
    date.innerHTML =  "Date: "+summary.date;
    author.innerHTML =  "Author: "+summary.author;
    bench.innerHTML =  "Bench: "+summary.bench;
    citation.innerHTML =  "Citation: "+summary.citation;

    var copyButton = document.getElementById("copy_button");
    copyButton.addEventListener('click', function(event) { // Listening to if the copy button is pressed
        console.log('Copy Button Clicked');
        var text = source.innerHTML + " \n" + title.innerHTML + " \n" + date.innerHTML + " \n" + author.innerHTML + " \n" + bench.innerHTML + " \n" + citation.innerHTML;
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(text); //Copying to Clipboard
            }
          });
    });  
    
    var excelCopyButton = document.getElementById("excel_copy_button")
    excelCopyButton.addEventListener('click', function(event) { // Listening to if the copy button is pressed
        var excelText = summary.source + " \t" + summary.title + " \t" + summary.date + " \t" + summary.citation + " \t" + summary.author + " \t" + summary.bench;
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(excelText); //Copying to Clipboard in Excel Style
            }
          });
    });
    
    var oscolaButton = document.getElementById("oscola_button");
    String(title.style.fontStyle = "italic");

    oscolaButton.addEventListener('click', function(event) { // Listening to if the copy button is pressed
        console.log('Oscola Button Clicked');
        var oscolatext = summary.title.italics() + " ["  + summary.year + "] " + summary.citation;
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(oscolatext); //Copying Oscola citation to Clipboard
            }
          });
    });

    document.addEventListener('keypress', function(e) {
        if (e.code == "KeyC"){
            copyButton.click();
        }
        else if (e.code == "KeyE"){
            excelCopyButton.click();
        }
    });

}

