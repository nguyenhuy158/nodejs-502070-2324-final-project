/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$(() => {
    let table = $("#customer-table")
        .DataTable({
            colReorder: {
                realtime: false
            },
            autoFill: false,
            language: {
                emptyTable: "No customer available"
            },
            buttons: [
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
                url: '/api/customers',
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
                    data: 'phone',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'fullName',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'address',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'gender',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'rank',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'email',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'birthDay',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        const viewBtn = `<a class="my-1 btn btn-sm btn-primary" href="/users/${row._id}">
                                    <i class='bx bx-detail'></i>
								</a>`;

                        const updateBtn = `<button class="my-1 btn btn-sm btn-success edit-btn">
                                    <i class='bx bx-edit'></i>
								</button>`;

                        const deleteBtn = `<button class="my-1 btn btn-sm btn-danger delete-btn">
                                    <i class='bx bx-trash-alt'></i>
								</button>`;

                        return `${viewBtn} ${updateBtn} ${deleteBtn}`;
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
        });
    });
});