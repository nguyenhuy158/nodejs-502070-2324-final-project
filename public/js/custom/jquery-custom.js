/* eslint-disable no-undef */

// function create product card and append to products container
(function ($) {
    $.fn.createProductCardAndAppend = function (productData) {
        const isExits = $(this).find(`[data-id="${productData._id}"]`).length !== 0;

        if (isExits) {
            toastr.error('Product already exists');
            return;
        }

        // console.log(`🚀 🚀 file: jquery-custom.js:5 🚀 productData`, productData.desc);
        let productCard = $(`
            <div class="product-card" data-id="${productData._id}">
                <div class="card">
                    <div class="img-box">
                        <img class="product-img" src="${productData.imageUrl}" alt="${productData.name}" width="80">
                    </div>
                    <div class="detail">
                        <h4 class="product-name">${productData.name}</h4>
                        <div class="wrapper">
                            <div class="product-qty d-flex align-items-center">
                                <button id="decrement" class="btn-decrement">
                                    <i class='bx bx-minus'></i>
                                </button>
                                <span class="quantity">${productData.quantity}</span>
                                <button id="increment" class="btn-increment">
                                    <i class='bx bx-plus'></i>
                                </button>
                            </div>
                            <div class="price">
                                <span class="price">${VND(productData.price).format()}</span>
                            </div>
                        </div>
                    </div>
                    <button class="product-close-btn btn-remove-product">
                        <i class='bx bx-x'></i>
                    </button>
                </div>
            </div>
        `);

        productCard = $(`
            <div class="card mb-3 product-card" data-id="${productData._id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-row align-items-center">
                            <div>
                                <img class="rounded-3" src="${productData.imageUrl}" alt="${productData.name}" style="width: 65px;">
                            </div>
                            <div class="ms-3">
                                <h5 class="text-wrap">${productData.name}</h5>
                                <p class="small mb-0 text-truncate" style="width: 65px;">${productData.desc}</p>
                                <h5 class="mb-0 text-nowrap price">${VND(productData.price).format()}</h5>
                            </div>
                        </div>
                        <div class="d-flex flex-row align-items-center">
                            <div style="width: 80px;" class="d-flex align-items-center gap-1">
                                <button id="decrement" class="btn-decrement">
                                    <i class='bx bx-minus'></i>
                                </button>
                                <h5 class="fw-normal mb-0 quantity">${productData.quantity}</h5>
                                <button id="increment" class="btn-increment">
                                    <i class='bx bx-plus'></i>
                                </button>
                            </div>
                            <a class="btn-remove-product pointer" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `);

        return this.append(productCard);
    };
})(jQuery);
// const productData = {
//     imageUrl: 'https://images.macrumors.com/t/TkNh1oQ0-9TnnBjDnLyuz6yLkjE=/1600x0/article-new/2023/09/iPhone-15-General-Feature-Black.jpg',
//     name: 'Iphone 15 Pro',
//     quantity: 1,
//     price: 1.25,
// };
// $('#products-container').createProductCardAndAppend(productData);

