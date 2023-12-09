/* eslint-disable no-undef */

const autoCompleteProductCheckout = new autoComplete({
    selector: "#autoCompleteProductCheckout",
    placeHolder: "Enter product barcode/name ...",
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
                $("#autoComplete").attr("placeholder", autoCompleteProductCheckout.placeHolder);
                // Returns Fetched data
                return data;
            } catch (error) {
                return error;
            }
        },
        cache: true,
        keys: ["phone", "accessories", "barcode"],
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
            // console.log(`🚀 🚀 file: checkout-autocomplete-product.js:63 🚀 data`, data);
            // console.log(`🚀 🚀 file: checkout-autocomplete-product.js:63 🚀 item`, item);
            
            item.style = "display: flex; justify-content: space-between;";

            if (data.key === "barcode") {
                item.innerHTML = `
                <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                    ${data.value.name}
                    <br/>
                    ${data.match}
                </span>
                <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
                    ${VND(data.value.price).format()}
                </span>`;
            } else {
                item.innerHTML = `
                <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                    ${data.match}
                </span>
                <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
                    ${VND(data.value.price).format()}
                </span>`;
            }
        },
        highlight: true
    },
    events: {
        input: {
            selection: (event) => {
                autoCompleteProductCheckout.input.blur();

                const selection = event.detail.selection.value.name;
                autoCompleteProductCheckout.input.value = selection;

                const productData = event.detail.selection.value;
                productData.quantity = 1;
                $("#products-container").createProductCardAndAppend(productData);

                const isExits = $('#products-container').find(`[data-id="${productData._id}"]`).length !== 0;
                if (!isExits) {
                    addProductToCartById(productData._id);
                    updateCart();
                }
            },
            focus: () => {
                if (autoCompleteProductCheckout.input.value.length) {
                    autoCompleteProductCheckout.start();
                }
            },
        }
    }
});


