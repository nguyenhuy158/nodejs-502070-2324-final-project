/* eslint-disable no-undef */
function assignEditEvent() {

}
function assignDeleteEvent() {
    console.log('confirm - user');

    const deleteButtons = $(".delete-btn");
    const modalTitle = $("#modalDelete .modal-title");
    const confirmModalBody = $("#modalDelete .modal-body");
    const confirmButton = $("#modalDelete .btn.btn-danger");

    deleteButtons.off('click').on('click', function () {
        const fullname = $(this).parent().siblings()[2].textContent;
        const userId = $(this).parents()[1].id;

        console.log(`🚀 🚀 file: confirm-user.js:17 🚀 userId`, userId);
        console.log(`🚀 🚀 file: confirm-user.js:13 🚀 fullname`, fullname);

        modalTitle.text('Delete confirm');
        confirmButton.text('Delete');
        confirmModalBody.html(`Are you sure you want to delete<strong>${fullname}</strong>?`);

        $('#modalDelete').modal('show');

        confirmButton.off('click').on('click', function () {
            $('#modalDelete').modal('hide');


            $.ajax({
                url: `/api/users/${userId}`,
                type: 'DELETE',
                success: (response) => {
                    console.log(`🚀 ------------------------------------------------------🚀`);
                    console.log(`🚀 🚀 file: 🚀 response`, response);
                    console.log(`🚀 ------------------------------------------------------🚀`);
                    showToast('success', response.message);
                    reloadTable();
                },
                error: (error) => {
                    console.log(`🚀 ------------------------------------------------🚀`);
                    console.log(`🚀 🚀 file: 🚀 error`, error.responseJSON);
                    console.log(`🚀 ------------------------------------------------🚀`);
                    showToast('error', error.responseJSON?.message);
                }
            });
        });
    });
}

// $(() => {
//     $(document).ready(function () {
//         const lockButtons = $(".lock-btn");
//         const unlockButtons = $(".unlock-btn");
//         const confirmModalBody = $("#modalDelete .modal-body");
//         const confirmButton = $("#modalDelete .btn.btn-danger");
//         const modalTitle = $("#modalDelete .modal-title");

//         function handleLockUnlock(button, isLock) {
//             button.click(function () {
//                 const fullname = button.data("user-name");
//                 const userId = button.data("user-id");
//                 const action = isLock ? "lock" : "unlock";
//                 modalTitle.text(isLock ? "Lock confirm" : "Unlock confirm");
//                 confirmButton.text(isLock ? "Lock" : "Unlock");
//                 confirmModalBody.html(`Are you sure you want to ${action} the account for
//                     <strong>${fullname}</strong>?`);
//                 $('#modalDelete').modal('show');
//                 confirmButton.click(function () {
//                     $('#modalDelete').modal('hide');
//                     fetch(`/users/${userId}/${action}`, {
//                         method: "PUT"
//                     })
//                         .then(response => response.json())
//                         .then(data => {
//                             location.reload();
//                         })
//                         .catch(error => {
//                             console.log(`Error in ${action}ing the account:`, error);
//                         });
//                 });
//             });
//         }

//         handleLockUnlock(lockButtons, true);
//         handleLockUnlock(unlockButtons, false);
//     });
// });