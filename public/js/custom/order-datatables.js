/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$(() => {
    let table = $("#order-table")
        .DataTable({
            columnDefs: [
                {
                    className: 'dtr-control',
                    orderable: false,
                    targets: 0
                }
            ],
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
                    type: 'column',
                    target: 'tr',
                    renderer: function (api, rowIdx, columns) {
                        // Get the data for the "products" column
                        var data = api.cell(rowIdx, 2).data();

                        // Create the content for the collapsed section
                        var content = '<p><strong>Products:</strong> ' + (data || '') + '</p>';

                        // Return the content
                        return content;
                    }
                }
            },
            rowId: '_id',
            scrollY: "50vh",
            scrollX: true,
            scrollCollapse: true,
            processing: true,
            autoWidth: true,
            ajax: {
                url: '/api/orders',
                dataSrc: ''
            },
            columns: [
                {
                    data: null,
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    },
                    orderable: false,
                    className: 'align-middle text-center'
                },
                {
                    data: 'customer',
                    render: function (data, type, row) {
                        return data.fullName || '';
                    },
                },
                {
                    data: 'totalAmount',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'givenAmount',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'changeAmount',
                    render: function (data, type, row) {
                        return data || '';
                    },
                },
                {
                    data: 'purchaseDate',
                    render: function (data, type, row) {
                        return moment(data).format('hh:mm DD/MM/YYYY') || '';
                    },
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        const viewBtn = `<a class="my-1 btn btn-sm btn-primary" href="/customers/${row._id}">
                                    <i class='bx bx-detail'></i>
								</a>`;

                        const updateBtn = `<button class="my-1 btn btn-sm btn-success edit-btn">
                                    <i class='bx bx-edit'></i>
								</button>`;

                        const purchaseHistoryBtn = `<a class="my-1 btn btn-sm btn-success purchase-btn" href="/customers/${row._id}/purchase">
                                    <i class='bx bx-history'></i>
								</a>`;

                        return `${viewBtn} ${updateBtn} ${purchaseHistoryBtn}`;
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

    $("#order-table")
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

    $('#reload-order-table').on('click', () => {
        $('#order-table').DataTable().ajax.reload(function (json) {
        });
    });
});