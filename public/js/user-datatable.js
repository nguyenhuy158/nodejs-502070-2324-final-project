/* eslint-disable no-undef */
$(() => {
    let table = $("#user-table")
        .DataTable({
            colReorder: {
                realtime: false
            },
            autoFill: false,
            buttons: [
                {
                    text: 'New Sale People',
                    action: function (e, dt, node, config) {
                        window.location = '/users/create-account';
                    }
                },
                {
                    text: 'Reload',
                    action: function (e, dt, node, config) {
                        dt.ajax.reload();
                    }
                },
                'spacer',
                {
                    extend: 'collection',
                    className: 'custom-html-collection',
                    buttons: [
                        '<h3>Export</h3>',
                        'copy',
                        'pdf',
                        'csv',
                        'excel',
                        'print',
                        '<h3 class="not-top-heading">Column Visibility</h3>',
                        'columnsToggle'
                    ]
                },
            ],
            dom: "B<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            responsive: {
                details: {
                    type: 'inline'
                }
            },
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
                    },
                    "defaultContent": "https://placehold.co/200"
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

    table.buttons().container().appendTo($('#button-container'));


    $("#user-table")
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