console.log("Content Script Running...");

//Listening to when popup (popup/script.js) is clicked
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getSummary":
                sendResponse(getSummary()); //Sending Summary to popup (popup/script.js)
                console.log("Summary Sent");
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);

function getSummary() {
    console.log("Creating Summary...");

    //Scapping for Document Source
    let doc_source = document.getElementsByClassName("docsource_main")[0].innerText;
    //Scapping for Document Title
    let doc_title = document.getElementsByClassName("doc_title")[0].innerText;
    var L = doc_title.split(" on "); // Splitting doc_title to seperate accuser/defender and Date 
    let title = L[0];
    let date = L[1]; 
    
    var Y = date.split(",");
    let month = Y[0];
    let year = Y[1];
    var author = null;
    var bench = null;
    var citation= null;
    // Trying to find author, bench & citation since some judgments do no contain it.
    try {
        author = document.getElementsByClassName("doc_author")[0].innerText;
        author = author.slice(8);
    } catch (error) {
        console.log("Author not found");
    }

    try {
        bench = document.getElementsByClassName("doc_bench")[0].innerText;
        bench = bench.slice(7);
    } catch (error) {
        console.log("Bench not found");
    }

    try {
        citation = document.getElementsByClassName("doc_citations")[0].innerText;
        citation = citation.slice(22);
    } catch (error) {
        console.log('Equivalent Citation not found')
        try {
            var pre = document.getElementById("pre_1").innerText;
            var writIndex = pre.search("WRIT PETITION");
            var civilAppealIndex = pre.search("CIVIL APPEAL");
            var criminalAppealIndex = pre.search(/Criminal Appeal/i);
            if(writIndex >= 0){
                var writ = pre.slice(writIndex).split("\n")[0];
                citation = writ;
            } else if(civilAppealIndex>=0){
                var civilAppeal = pre.slice(civilAppealIndex).split("\n")[0];
                citation = civilAppeal;
            } else if(criminalAppealIndex>=0){
                var criminalAppeal = pre.slice(criminalAppealIndex).split("\n")[0];
                citation = criminalAppeal;
            } else if(civilAppealIndex==-1){
                console.log(pre);
                civilAppealIndex = pre.search("Appeal");
                var civilAppeal = pre.slice(civilAppealIndex).split("\n")[0];
                citation = civilAppeal;
                console.log(civilAppealIndex);
            }
            
        } catch (error) {
            console.log("Citation not found");
        }
    }

    

    // Making an Object containing all data
    let summary = {
        source : doc_source,
        title : title,
        date : date,
        month : month,
        year : year,
        author : author,
        bench : bench,
        citation : citation,
    }
    console.log(summary);
    return summary;
}