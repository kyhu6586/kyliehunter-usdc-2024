

/**
 * Resources Used: https://www.microverse.org/blog/how-to-loop-through-the-array-of-json-objects-in-javascript
 * https://www.w3schools.com/js/js_string_methods.asp
 * https://www.w3schools.com/js/js_string_search.asp
 * https://codedamn.com/news/javascript/check-if-undefined-null
 *
*/

/**
 * Searches for matches in scanned text. Assumptions: The lines of the book are scanned in order.
 * Additionally, whenever a line ends with a single dash (not the em dash, which is a completely separate character), 
 * that is assumed to indicate a word that is broken down the middle, and not meant to indicate subtraction or 
 * anything else.
 * @param {string} searchTerm - The word or term we're searching for. If this search term is a hyphen, it will 
 * return the line in which a hyphen appears even if the hyphen indicates a broken word. If the start of a word plus 
 * a hyphen is found, even if the hyphen indicates a broken word, the line with the start of the word and hyphen 
 * will be returned anyways. Spaces do count in the search term! I did not trim the seach term for leading or trailing
 * characters, so it searches for an exact match. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text. Every object in the list must contain
 * the fields of title, ISBN, Content, and every object in the Content list must contain page, line, and text, even 
 * if those fields are null or undefined.
 * @returns {JSON} - Search results. If there is a hyphenated word, the line and page number returned is the line and 
 * page number that the word starts on. If there are no matches, the Results key of the return object will be empty.
 * */
function findSearchTermInBooks(searchTerm, scannedTextObj) {
    //matches is the variable name to which I will be adding the results of the search
    const matches = { "SearchTerm": searchTerm, "Results": [] }
    for (let book = 0; book < scannedTextObj.length; book++) {
        //bookObj is a shorter way of referencing the specific list item in scannedTextObj
        const bookObj = scannedTextObj[book];
        //This line checks to make sure that the content is not void or undefined-- if it is, skip to the next iteration
        if (isNotValid(bookObj["Content"])) { continue; }
        //Now we are iterating through the book content, one by one.
        for (let line = 0; line < bookObj["Content"].length; line++) {
            //lineObj is a shorter way of referencing a content object within the certain book
            const lineObj = bookObj["Content"][line];
            //comparisonLine is the text of the line that we are searching
            let comparisonLine = lineObj["Text"];
            //lastWord is a variable used primarily in the case of a word that is broken between two lines, represented by a hyphen
            let lastWord = "";
            //check to make sure that we have a comparisonLine that isn't null or undefined
            if (isNotValid(comparisonLine)) { continue; }
            //This is the hyphen check-- if we are not on the last line of the book and the last character of the line is a hyphen, we have a broken word
            if (lineObj["Text"].slice(-1) == "-" && line < bookObj["Content"].length - 1) {
                //get characters after last space and before hyphen (i.e. first half of the broken word)
                const noHyphen = lineObj["Text"].substring(lineObj["Text"].lastIndexOf(" "), lineObj["Text"].length - 1);
                //get nextline word before first space (i.e. last half of the broken word)
                const nextLine = bookObj["Content"][line + 1]["Text"].substring(0, bookObj["Content"][line + 1]["Text"].indexOf(" "));
                //append them together
                lastWord = noHyphen + nextLine;
            }
            //check both the lastWord and the comparisonLine to see if they include the search term (case sensitive)
            if (lastWord.includes(searchTerm) || comparisonLine.includes(searchTerm)) {
                //if so, make a match object to add to the results list, matches
                const match = { "ISBN": bookObj["ISBN"], "Page": lineObj["Page"], "Line": lineObj["Line"] }
                //push it to matches
                matches["Results"].push(match);
            }
        }
    }
    //return results list, even if no matches were found
    return matches;
}

/**
 * This is a short method to verify if an object is undefined or null
 * @param {JSON} obj - the object to check
 * @returns {boolean} - A true or false indicating if the object is either null or undefined. True if it is, false if not.
 * */

function isNotValid(obj) {
    return obj === undefined || obj === null;
}


/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            }
        ]
    }
]

const emptyIn = []
const sampleIn = [
    {
        "Title": "Happy Book of Dashes",
        "ISBN": "000000000",
        "Content": [
            {
                "Page": 12,
                "Line": 1,
                "Text": "-- dash - dash -- dash dash - dash dash-"
            },
            {
                "Page": 12,
                "Line": 2,
                "Text": "dash - dash --- dashing and dashing -"
            },
        ]
    },
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            }
        ]
    },
    {
        "Title": "Harry Potter and the Order of the Phoenix",
        "ISBN": "000000001",
        "Content": []
    },
    {
        "Title": null,
        "ISBN": null,
        "Content": undefined
    },
    {
        "Title": "The Happy Book of weird stuff",
        "ISBN": "0000000002",
        "Content": [{ "Page": null, "Line": null, "Text": null }]
    },
    {
        "Title": "The Happy Book of weird stuff 2",
        "ISBN": "0000000003",
        "Content": [{ "Page": null, "Line": null, "Text": "Happy Happy Days" }]
    }
]

/** Example output object */
const twentyLeaguesOut1 = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

const twentyLeaguesOut3 = {
    "SearchTerm": "darkness",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
}



const twentyLeaguesOut4 = {
    "SearchTerm": "fdfd",
    "Results": []
}

const twentyLeaguesOut5 = {
    "SearchTerm": " ",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        },
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        },
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 10
        }

    ]
}

const emptyOut6 = {
    "SearchTerm": "fdfd",
    "Results": []
}

const sampleOut7 = {
    "SearchTerm": "dashdash",
    "Results": [{
        "ISBN": "000000000",
        "Page": 12,
        "Line": 1
    }]
}

const sampleOut8 = {
    "SearchTerm": "-",
    "Results": [{
        "ISBN": "000000000",
        "Page": 12,
        "Line": 1
    }, {
        "ISBN": "000000000",
        "Page": 12,
        "Line": 2
    }, {
        "ISBN": "9780000528531",
        "Page": 31,
        "Line": 8
    }]
}

const sampleOut9 = {
    "SearchTerm": "Happy",
    "Results": [{
        "ISBN": "0000000003",
        "Page": null,
        "Line": null
    }]
}

const twentyLeaguesOut10 = {
    "SearchTerm": "dark-",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
}
const twentyLeaguesOut11 = {
    "SearchTerm": "The",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
}

const twentyLeaguesOut12 = {
    "SearchTerm": " The  ",
    "Results": []
}
/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___|
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/

 */

/* We have provided two unit tests. They're really just `if` statements that
 * output to the console. We've provided two tests as examples, and
 * they should pass with a correct implementation of `findSearchTermInBooks`.
 *
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut1) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn);
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

//This is a test to see if the code finds the broken word, darkness
const test3result = findSearchTermInBooks("darkness", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut3) === JSON.stringify(test3result)) {
    console.log("PASS: Test 3");
} else {
    console.log("FAIL: Test 3");
    console.log("Expected:", twentyLeaguesOut3);
    console.log("Received:", test3result);
}

//This is a test to make sure that the code does not find a term that does not exist
const test4result = findSearchTermInBooks("fdfd", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut4) === JSON.stringify(test4result)) {
    console.log("PASS: Test 4");
} else {
    console.log("FAIL: Test 4");
    console.log("Expected:", twentyLeaguesOut4);
    console.log("Received:", test4result);
}

//This is a test to make sure the code finds a result that appears frequently
const test5result = findSearchTermInBooks(" ", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut5) === JSON.stringify(test5result)) {
    console.log("PASS: Test 5");
} else {
    console.log("FAIL: Test 5");
    console.log("Expected:", twentyLeaguesOut5);
    console.log("Received:", test5result);
}

//This is a test to make sure the code can handle an empty list
const test6result = findSearchTermInBooks("fdfd", emptyIn);
if (JSON.stringify(emptyOut6) === JSON.stringify(test6result)) {
    console.log("PASS: Test 6");
} else {
    console.log("FAIL: Test 6");
    console.log("Expected:", emptyOut6);
    console.log("Received:", test6result);
}

//This is a test to make sure the code can handle a broken word again
const test7result = findSearchTermInBooks("dashdash", sampleIn);
if (JSON.stringify(sampleOut7) === JSON.stringify(test7result)) {
    console.log("PASS: Test 7");
} else {
    console.log("FAIL: Test 7");
    console.log("Expected:", emptyOut7);
    console.log("Received:", test7result);
}

//This is a test to see how the code handles hyphens
const test8result = findSearchTermInBooks("-", sampleIn);
if (JSON.stringify(sampleOut8) === JSON.stringify(test8result)) {
    console.log("PASS: Test 8");
} else {
    console.log("FAIL: Test 8");
    console.log("Expected:", sampleOut8);
    console.log("Received:", test8result);
}

//This is a test to make sure the code can handle null entries in page and line
const test9result = findSearchTermInBooks("Happy", sampleIn);
if (JSON.stringify(sampleOut9) === JSON.stringify(test9result)) {
    console.log("PASS: Test 9");
} else {
    console.log("FAIL: Test 9");
    console.log("Expected:", sampleOut9);
    console.log("Received:", test9result);
}
//This is a test to make sure the code behaves as expected when the first part of a broken word and the hyphen is searched
const test10result = findSearchTermInBooks("dark-", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut10) === JSON.stringify(test10result)) {
    console.log("PASS: Test 10");
} else {
    console.log("FAIL: Test 10");
    console.log("Expected:", twentyLeaguesOut10);
    console.log("Received:", test10result);
}

//This is a test to see if the case sensitivity behaves as expected.
const test11result = findSearchTermInBooks("The", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut11) === JSON.stringify(test11result)) {
    console.log("PASS: Test 11");
} else {
    console.log("FAIL: Test 11");
    console.log("Expected:", twentyLeaguesOut11);
    console.log("Received:", test11result);
}

//This is a test to see if trailing and/or leading spaces behave as expected.
const test12result = findSearchTermInBooks(" The  ", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut12) === JSON.stringify(test12result)) {
    console.log("PASS: Test 12");
} else {
    console.log("FAIL: Test 12");
    console.log("Expected:", twentyLeaguesOut12);
    console.log("Received:", test12result);
}
