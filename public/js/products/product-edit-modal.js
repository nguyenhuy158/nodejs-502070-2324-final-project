$(document)
    .ready(function () {
        const editButton            = $(".btn-edit");
        const editModal             = $("#modal-product-edit");
        const editForm              = $("#edit-product");
        const editModalTitle        = $("#modal-product-edit .modal-title");
        const editConfirmModalBody  = $("#modal-product-edit .modal-body");
        const editConfirmSaveButton = $("#modal-product-edit .btn.btn-success");
        
        editButton.on("click", function () {
            editModalTitle.text(`Edit ${1}`);
            const productId = $(this)
                .data("product-id");
            
            $.ajax({
                       url    : `/products/${productId}`,
                       type   : "GET",
                       success: function (response) {
                           const { product } = response;
                           // console.log("=>(product-edit-modal.js:38) product", product);
                           
                           editForm.find("input[name=\"productName\"]")
                                   .val(product.productName);
                           
                           editForm.find("input[name=\"importPrice\"]")
                                   .val(product.importPrice);
                           
                           editForm.find("input[name=\"retailPrice\"]")
                                   .val(product.retailPrice);
                           
                           editForm.find("textarea[name=\"desc\"]")
                                   .val(product.desc);
                           
                           // product.imageUrls.forEach(imageUrl => {
                           //     const img = $(`<img src="${imageUrl}" height="100" width="100" class="img-preview">`);
                           //     $(".image-urls-list")
                           //         .append(img);
                           // });
                           
                           editModal.modal("show");
                       },
                       error  : function (error) {
                           console.log("Error:", error);
                           showToast(error, "error");
                       }
                   });
            
            editForm.on("submit", function (e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                console.log(`=>(product-edit-modal.js:47) formData`, formData);
                
                $.ajax({
                           url        : `/products/${productId}`,
                           type       : "PUT",
                           data       : formData,
                           processData: false,
                           contentType: false,
                           success    : function (response) {
                               console.log("Response:", response);
                               showToast(response.message, "success");
                               window.location = "/products";
                           },
                           error      : function (error) {
                               console.log("Error:", error);
                               showToast(error, "success");
                           }
                       });
            });
        });
    });