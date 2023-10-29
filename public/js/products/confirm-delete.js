$(document)
    .ready(function () {
        const deleteButtons       = $(".delete-btn");
        const modalTitle          = $("#modalDelete .modal-title");
        const confirmModalBody    = $("#modalDelete .modal-body");
        const confirmDeleteButton = $("#modalDelete .btn.btn-danger");
        
        deleteButtons.click(function () {
            const productName = $(this)
                .data("product-name");
            const productId   = $(this)
                .data("product-id");
            confirmModalBody.html(`Are you sure you want to delete
                <strong>${productName}</strong>?`);
            $("#modalDelete")
                .modal("show");
            
            confirmDeleteButton.click(function () {
                $("#modalDelete")
                    .modal("hide");
                console.log("click");
                console.log(`/products/${productId}`);
                fetch(`/products/${productId}`, {
                    method: "DELETE"
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("=>(list.pug:113) data", data);
                        location.reload();
                    })
                    .catch(error => {
                        console.log("Error in deleting:", error);
                    });
            });
        });
    });