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
                    className: 'reload-btn',
                    text: 'Reload',
                    action: function (e, dt, node, config) {
                        dt.ajax.reload();
                    }
                },
                'spacer',
                {
                    extend: 'collection',
                    className: 'options-btn',
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
                        return VND(data).format();
                    },
                },
                {
                    data: 'givenAmount',
                    render: function (data, type, row) {
                        return VND(data).format();
                    },
                },
                {
                    data: 'changeAmount',
                    render: function (data, type, row) {
                        return `-${VND(-data).format()}`;
                    },
                },
                {
                    data: 'purchaseDate',
                    render: function (data, type, row) {
                        return moment(data).format('hh:mm DD/MM/YYYY') || '';
                    },
                },
                {
                    data: 'seller',
                    render: function (data, type, row) {
                        return data.fullName;
                    },
                },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        const viewBtn = `<a class="my-1 btn btn-sm btn-outline-primary view-order-btn" href="/orders/${row._id}">
                                    <i class='bx bx-detail'></i>
								</a>`;

                        const printOrderBtn = `<button class="my-1 btn btn-sm btn-outline-success print-btn" data-order-id="${row._id}">
                                    <i class='bx bx-printer'></i>
								</button>`;

                        return `${viewBtn} ${printOrderBtn}`;
                    }
                },
            ]
        });

    $(document).off('click', '.print-btn').on('click', '.print-btn', function () {
        const orderId = $(this).data('order-id');
        // print recipe
        $('#frMauIn').attr('src', `/checkout/recipe/${orderId}`);
        setTimeout(function () {
            window.frames["frMauIn"].focus();
            window.frames["frMauIn"].print();
        }, 3000);
    });

    table.on('draw.dt', function () {
        var info = table.page.info();
        table.column(0, { search: 'applied' })
            .nodes()
            .each(function (cell, i) {
                cell.innerHTML = i + 1 + info.start;
            });
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