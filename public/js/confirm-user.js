/* eslint-disable no-undef */
$(() => {
    $(document).ready(function () {
        const lockButtons = $(".lock-btn");
        const unlockButtons = $(".unlock-btn");
        const confirmModalBody = $("#modalDelete .modal-body");
        const confirmButton = $("#modalDelete .btn.btn-danger");
        const modalTitle = $("#modalDelete .modal-title");

        function handleLockUnlock(button, isLock) {
            button.click(function () {
                const fullname = button.data("user-name");
                const userId = button.data("user-id");
                const action = isLock ? "lock" : "unlock";
                modalTitle.text(isLock ? "Lock confirm" : "Unlock confirm");
                confirmButton.text(isLock ? "Lock" : "Unlock");
                confirmModalBody.html(`Are you sure you want to ${action} the account for
                    <strong>${fullname}</strong>?`);
                $('#modalDelete').modal('show');
                confirmButton.click(function () {
                    $('#modalDelete').modal('hide');
                    fetch(`/users/${userId}/${action}`, {
                        method: "PUT"
                    })
                        .then(response => response.json())
                        .then(data => {
                            location.reload();
                        })
                        .catch(error => {
                            console.log(`Error in ${action}ing the account:`, error);
                        });
                });
            });
        }

        handleLockUnlock(lockButtons, true);
        handleLockUnlock(unlockButtons, false);
    });
});
$(() => {
    const deleteButtons = $(".delete-btn");
    const modalTitle = $("#modalDelete .modal-title");
    const confirmModalBody = $("#modalDelete .modal-body");
    const confirmButton = $("#modalDelete .btn.btn-danger");
    deleteButtons.click(function () {
        const fullname = $(this).data("user-name");
        const userId = $(this).data("user-id");
        console.log("=>(list.pug:99) userId", userId);
        modalTitle.text('Delete confirm');
        confirmButton.text('Delete');
        confirmModalBody.html(`Are you sure you want to delete
				<strong>${fullname}</strong>?`);
        $('#modalDelete').modal('show');
        confirmButton.click(function () {
            $('#modalDelete').modal('hide');
            console.log('click');
            console.log(`/users/${userId}`);
            fetch(`/users/${userId}`, {
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