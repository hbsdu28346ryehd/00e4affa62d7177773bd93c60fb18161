function soundex(str) {
    // Make sure the input is a string
    str = (str + '').toUpperCase().replace(/[^A-Z]/g, '');

    // Remove consecutive duplicates
    str = str.charAt(0) + str.slice(1).replace(/([AEIOUYHW])\1+/g, '$1');

    // Replace remaining letters with codes
    str = str
        .replace(/[BFPV]/g, '1')
        .replace(/[CGJKQSXZ]/g, '2')
        .replace(/[DT]/g, '3')
        .replace(/[L]/g, '4')
        .replace(/[MN]/g, '5')
        .replace(/[R]/g, '6');

    // Remove all zeros
    str = str.replace(/0/g, '');

    // Pad with zeros to make it a 4-character code
    str = str + '000';
    return str.slice(0, 5);
}

function metaphone(word) {
    // Remove non-alphabetic characters and convert to uppercase
    word = word.toUpperCase().replace(/[^A-Z]/g, '');

    // Define the code mappings
    const codes = {
        B: 'P',
        C: 'K',
        D: 'T',
        F: 'F',
        G: 'K',
        H: '',
        J: 'J',
        K: 'K',
        L: 'L',
        M: 'M',
        N: 'N',
        P: 'P',
        Q: 'K',
        R: 'R',
        S: 'S',
        T: 'T',
        V: 'F',
        W: 'W',
        X: 'KS',
        Y: 'Y',
        Z: 'S'
    };

    // Apply the code mappings to the word
    let code = '';
    let prevCode = '';
    for (let i = 0; i < word.length; i++) {
        const letter = word.charAt(i);
        const nextLetter = word.charAt(i + 1);
        const nextNextLetter = word.charAt(i + 2);
        let mappedCode = codes[letter];

        // Special cases for letter combinations
        if (letter === 'C' && nextLetter === 'I' && nextNextLetter === 'A') {
            mappedCode = 'X';
        } else if (letter === 'S' && nextLetter === 'I' && (nextNextLetter === 'O' || nextNextLetter === 'A')) {
            mappedCode = 'X';
        } else if (letter === 'C' && nextLetter === 'H') {
            if (i === 0 && nextNextLetter !== 'A' && nextNextLetter !== 'O' && nextNextLetter !== 'U') {
                mappedCode = 'K';
            } else if (prevCode === 'S' && nextNextLetter === 'R') {
                mappedCode = 'K';
            } else {
                mappedCode = 'X';
            }
        } else if (letter === 'P' && nextLetter === 'H') {
            mappedCode = 'F';
        } else if (letter === 'S' && nextLetter === 'H') {
            if (nextNextLetter === 'O' || nextNextLetter === 'A') {
                mappedCode = 'X';
            } else {
                mappedCode = 'S';
            }
        }

        // Ignore duplicates
        if (i > 0 && mappedCode === prevCode) {
            continue;
        }

        // Add the code to the result
        code += mappedCode;
        prevCode = mappedCode;
    }

    // Remove any trailing H or W
    code = code.replace(/[HW]$/, '');

    return code;
}

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function searchList(query, list) {
    const regex = new RegExp(query, 'i');
    const matches = new Set(list.filter(item => regex.test(item)).slice(0, 10));
    return Array.from(matches);
}

function searchByQuery() {
    // Load the JSON data from file
    fetch('/databases/insuranceKeywordsDB.json')
        .then(response => response.json())
        .then(data => {
            const searchKeys = data[0]['searchKeys'];

            // Get the input field and create the autocomplete instance
            const input = document.getElementById("search_query_input");
            const list = document.getElementById('search_recommadation');
            list.innerHTML = '';
            const searchQuery = input.value.toLowerCase();
            const matches = searchList(searchQuery.trim(), searchKeys)
            for (var i = 0; i < matches.length; i++) {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = "/search?q=" + matches[i];
                link.innerHTML = `<span>&#10138;</span>&ensp;${matches[i]}`;
                listItem.appendChild(link);
                list.appendChild(listItem);
            }
            if (input.value.trim() === "") {
                list.innerHTML = "";
            }
        });
}
var search_by_query = debounce(() => searchByQuery());


// Load the JSON data from the file
fetch('/databases/insuranceData.json')
    .then(response => response.json())
    .then(data => {
        // Get the URLSearchParams object from the current URL
        const urlSearchParams = new URLSearchParams(window.location.search);

        // Get the value of the "q" parameter from the URLSearchParams object
        const query = urlSearchParams.get("q");
        let resultsList = document.getElementById('results_container');
        if (query !== null) {
            document.getElementById('search_query_input').value = query;
    
            // Filter the data based on the search query
            const filteredData = data.filter(item => {
                const name = item.name.toLowerCase();
                const description = item.description.toLowerCase();
                const keywords = item.keywords;
                // Search keyword through array
                const searchSet = new Set(keywords.map(item => item.toLowerCase()));
                const isQueryMatched = searchSet.has(query.toLowerCase());

                return name.includes(query.toLowerCase()) || ((isQueryMatched) || description.includes(query.toLocaleLowerCase()));
            });
    
            document.querySelector("#results_count").innerHTML = `About <span>${filteredData.length}</span> results`;
            // Display the search results
            if (filteredData.length > 0) {
                filteredData.forEach((item, index) => {
                    let card = "";
                    let thumbnail = "";
                    if ("thumbnail" in item) {
                        thumbnail = item.thumbnail;
                    }
                    if (index % 2 == 0) {
                        card = `
                        <div class="box">
                            <a href="${item.url}" class="result-card result-card-opposite" role="button" target="_blank">
                                <div class="card-text">
                                    <h2>${item.name}</h2>
                                    <p>${item.description}</p>
                                    <ul class="keywords">
                                        <li>${item.keywords[0]}</li>
                                        <li>${item.keywords[1]}</li>
                                        <li>${item.keywords[2]}</li>
                                    </ul>
                                </div>
                                <div class="thumbnail"><img src="${thumbnail}" alt="${item.name} illustration"></div>
                            </a>
                        </div>`;
                    } else {
                        card = `
                            <div class="box">
                                <a href="${item.url}" class="result-card" role="button" target="_blank">
                                    <div class="thumbnail"><img src="${thumbnail}" alt="${item.name} illustration"></div>
                                    <div class="card-text">
                                        <h2>${item.name}</h2>
                                        <p>${item.description}</p>
                                        <ul class="keywords">
                                            <li>${item.keywords[0]}</li>
                                            <li>${item.keywords[1]}</li>
                                            <li>${item.keywords[2]}</li>
                                        </ul>
                                    </div>
                                </a>
                            </div>`;
                    }
                    resultsList.innerHTML += card;
                });
            } else {
                const card = `
                    <div class="box">
                        <div class="result-card">
                            <div class="card-text">
                                <h2>No matching results...</h2>
                                <p>Try to search something related to insurance.</p>
                            </div>
                        </div>
                    </div>`;
                resultsList.innerHTML += card;
            }
        } else {
            document.querySelector("#results_count").style.display = "none";
            const card = `
                <div class="box">
                    <div class="result-card">
                        <div class="card-text">
                            <h2>Search something...</h2>
                            <p>Try to search something related to insurance.</p>
                        </div>
                    </div>
                </div>`;
            resultsList.innerHTML += card;
        }
    })
    .catch(error => console.error(error));

const inputField = document.getElementById('search_query_input');
const divElement = document.getElementById('search_results_box');

inputField.addEventListener('focusout', (event) => {
    if (!divElement.contains(event.relatedTarget)) {
        // Perform the necessary actions if the focus out event occurred outside of the div element
        console.log('Focus out event occurred outside of the div element.');
        document.getElementById("search_recommadation").innerHTML = "";
    }
});