$(() => {
    let table = $("#user-table")
        .DataTable({
            rowId: '_id',
            scrollY: "50vh",
            scrollX: true,
            scrollCollapse: true,
            processing: true,
            autoWidth: true,
            ajax: {
                url: '/api/users',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    },
                    orderable: false,
                    className: 'align-middle text-center'
                },
                {
                    data: 'profilePicture',
                    render: function (data, type, row) {
                        return `<a class="image-popup" href=${data} title="${row.fullName}">
									<img class="lazy" width="100" height="100" data-src="${data}"/>
									</a>`;
                    }
                },
                {
                    data: 'email',
                    render: (data) => {
                        return `<span class="d-inline-block text-truncate" style="max-width: 100px;">${data}</span>`;
                    },
                    width: "20%"
                },
                {
                    data: 'username',
                    render: function (data, type, row) {
                        return `<a href="/users/${row._id}">${data}</a>`;
                    }
                },
                { data: 'fullName' },
                { data: 'role' },
                { data: 'isFirstLogin' },
                { data: 'inactivateStatus' },
                {
                    data: 'lockedStatus',
                    className: 'align-middle text-center',
                    render: function (data, type, row, meta) {
                        const btnLock = '<span class="iconify" data-icon="material-symbols:cancel-rounded"></span>';
                        const btnUnlock = '<span class="iconify" data-icon="material-symbols:check-circle-rounded"></span>';
                        return data ? btnLock : btnUnlock;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        const viewBtn = `<a class="my-1 btn btn-primary" href="/users/${row._id}">
								<span class="iconify" data-icon="carbon:view"></span>
								</a>`;

                        const updateBtn = `<button class="my-1 btn btn-success btn-edit">
								<span class="iconify" data-icon="mingcute:edit-line"></span>
								</button>`;

                        const deleteBtn = `<button class="my-1 btn btn-danger delete-btn">
								<span class="iconify" data-icon="mdi:delete-outline"></span>
								</button>`;

                        const lockBtn = `<button class="my-1 btn btn-warning lock-btn">
								<span class="iconify" data-icon="material-symbols:lock-outline"></span>
								</button>`;

                        const unLockBtn = `<button class="my-1 btn btn-info unlock-btn">
								<span class="iconify" data-icon="basil:unlock-outline"></span>
								</button>`;

                        const demo = ``;


                        return `${viewBtn} ${updateBtn} ${deleteBtn} ${row.lockedStatus ? unLockBtn : lockBtn}`;
                    }
                },
            ]
        });
    table.on('draw.dt', function () {
        var info = table.page.info();
        table.column(0, { search: 'applied' })
            .nodes()
            .each(function (cell, i) {
                cell.innerHTML = i + 1 + info.start;
            });
        lazyImageLoading();
        magnificPopup();
    });
    $("#product-table")
        .DataTable({
            retrieve: true,
            stateSave: true,
            stateSaveCallback: function (settings, data) {
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
            },
            stateLoadCallback: function (settings) {
                return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance));
            }
        });

    $('#reload-user-table').on('click', () => {
        $('#user-table').DataTable().ajax.reload(function (json) {
            console.log("The data has been refreshed:", json);
        });
    });
});