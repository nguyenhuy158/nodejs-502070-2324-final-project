function asignDeleteEvent() {
    const deleteButtons = $(".delete-btn");
    const modalTitle = $("#modalDelete .modal-title");
    const confirmModalBody = $("#modalDelete .modal-body");
    const confirmDeleteButton = $("#modalDelete .btn.btn-danger");
    deleteButtons.on('click', function () {
        const productName = $(this).parent().siblings()[2].textContent;
        const productId = $(this).parents()[1].id;

        confirmModalBody.html(`Are you sure you want to delete <strong>${productName}</strong>?`);

        $("#modalDelete")
            .modal("show");

        confirmDeleteButton.off('click').on('click', function () {
            $("#modalDelete").modal("hide");

            console.log(`/products/${productId}`);
            $.ajax(
                {
                    url: `/api/products/${productId}`,
                    type: 'DELETE',
                    success: (data) => {
                        showToast("success", 'Deleted successfully');
                        reloadTable();
                    },
                    error: (error) => {
                        showToast("error", "Delete fail! please try again!");
                    }
                }
            );
        });
    });
}