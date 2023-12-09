/* eslint-disable no-undef */

const autoCompleteJS = new autoComplete({
    selector: "#autoComplete",
    placeHolder: "Search product...",
    data: {
        src: async () => {
            try {
                // Loading placeholder text
                $("#autoComplete").attr("placeholder", "Loading...");
                // Fetch External Data Source
                const source = await fetch(
                    `/search?q=iphone`, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }
                );
                const data = await source.json();
                // Post Loading placeholder text
                $("#autoComplete").attr("placeholder", autoCompleteJS.placeHolder);
                // Returns Fetched data
                return data;
            } catch (error) {
                return error;
            }
        },
        cache: true,
        keys: ["phone", "accessories"],
        filter: (list) => {
            // Filter duplicates
            // incase of multiple data keys usage
            const filteredResults = Array.from(
                new Set(list.map((value) => value.match))
            ).map((item) => {
                return list.find((value) => value.match === item);
            });
            // console.log(`🚀 🚀 file: search.js:33 🚀 list`, list);
            // console.log(`🚀 🚀 file: search.js:33 🚀 filteredResults`, filteredResults);

            return filteredResults;
        },
    },
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                // Create "No Results" message element
                const message = document.createElement("div");
                // Add class to the created element
                message.setAttribute("class", "no_result");
                // Add message text content
                message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                // Append message element to the results list
                list.prepend(message);
            }
        },
        noResults: true,
        maxResults: 7,
        tabSelect: true
    },
    resultItem: {
        element: (item, data) => {
            // Modify Results Item Style
            item.style = "display: flex; justify-content: space-between;";
            // Modify Results Item Content
            item.innerHTML = `
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                ${data.match}
            </span>
            <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
                ${VND(data.value.price).format()}            </span>`;
        },
        highlight: true
    },
    events: {
        input: {
            selection: (event) => {
                autoCompleteJS.input.blur();

                const selection = event.detail.selection.value.name;
                autoCompleteJS.input.value = selection;

                const feedback = event.detail;
                console.log(`🚀 🚀 file: search.js:85 🚀 feedback`, feedback);
                window.location.href = `/products/${feedback.selection.value._id}`;
            },
            focus: () => {
                if (autoCompleteJS.input.value.length) {
                    autoCompleteJS.start();
                }
            },
            keydown: (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    $('#search-form').submit();
                }
            }
        }
    }
});


$("#search-form").on("submit", function (e) {
    if (!validateSearch()) {
        e.preventDefault();
    }
});

function validateSearch() {
    const searchTerm = autoCompleteJS.input.value;
    if (searchTerm.length <= 0) {
        toastr.error("Please enter a search term");
        return false;
    }
    return true;
}

// ["click", "input"].forEach((evt) => {
//     searchInput.on(evt, function () {
//         const searchTerm = searchInput.val();
//         performSearch(searchTerm);
//     });
// });

// $(document).on("click", function (e) {
//     if (!searchInput.is(e.target) && !searchResults.is(e.target)) {
//         searchResults.css("display", "none");
//     }
// });

