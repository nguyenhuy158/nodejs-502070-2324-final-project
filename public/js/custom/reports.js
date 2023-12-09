/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

$(() => {
    const autocolors = window['chartjs-plugin-autocolors'];
    Chart.register(autocolors);

    $('input[name="dates"]').daterangepicker({
        startDate: moment(),
        endDate: moment().add(1, 'days'),
        ranges: {
            'Today': [moment().startOf('day'), moment().endOf('day')],
            'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'This Year': [moment().startOf('year'), moment().endOf('year')],
            'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        },
    }, function (start, end, label) {

    });

    $('#daterange').on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('YYYY-MM-DD');
        const endDate = picker.endDate.format('YYYY-MM-DD');
        const type = $('#type').val();

        customerChart(startDate, endDate);
        profitChart(startDate, endDate, type);
        salesChart(startDate, endDate);
        sellerChart(startDate, endDate);
    });
    customerChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    profitChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), $('#type').val());
    salesChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    sellerChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));


    function sellerChart(startDate, endDate) {
        const ajaxResponse = fetch(`/reports/seller?from=${startDate}&to=${endDate}&type=${type}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                const labels = ajaxResponse.data.map(entry => entry.seller.fullName);
                const data = ajaxResponse.data.map(entry => entry.totalAmountSold);

                const ctx1 = document.getElementById('sellerChart').getContext('2d');

                const existingChart = Chart.getChart(ctx1);

                if (existingChart) {
                    existingChart.destroy();
                }

                const salesChart = new Chart(ctx1, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Customer',
                            data: data,
                            borderWidth: 2,
                            borderSkipped: false,
                            pointStyle: 'circle',
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                            },
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                text: 'Salespeople Income Chart',
                                display: true,
                            },
                            colors: {
                                enabled: false,
                                forceOverride: true
                            },
                            autocolors: {
                                repeat: 2,
                                offset: 5
                            },
                            crosshair: {
                                sync: {
                                    enabled: false,
                                    suppressTooltips: false
                                },
                                zoom: {
                                    enabled: true,
                                    zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
                                    zoomboxBorderColor: '#48F',
                                    zoomButtonText: 'Reset Zoom',
                                    zoomButtonClass: 'reset-zoom btn btn-sm btn-outline-info',
                                },
                            }
                        }
                    }
                });
            });
    }

    function customerChart(startDate, endDate) {
        const ajaxResponse = fetch(`/reports/customer?from=${startDate}&to=${endDate}&type=${type}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                const labels = ajaxResponse.data.map(entry => entry.customer.fullName);
                const data = ajaxResponse.data.map(entry => entry.totalAmountSpent);

                const ctx1 = document.getElementById('customerChart').getContext('2d');

                const existingChart = Chart.getChart(ctx1);

                if (existingChart) {
                    existingChart.destroy();
                }

                const salesChart = new Chart(ctx1, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Customer',
                            data: data,
                            borderWidth: 2,
                            borderSkipped: false,
                            pointStyle: 'circle',
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                            },
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                text: 'Payment customer Chart',
                                display: true,
                            },
                            colors: {
                                enabled: false,
                                forceOverride: true
                            },
                            autocolors: {
                                repeat: 2,
                                offset: 5
                            },
                            crosshair: {
                                sync: {
                                    enabled: false,
                                    suppressTooltips: false
                                },
                                zoom: {
                                    enabled: true,
                                    zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
                                    zoomboxBorderColor: '#48F',
                                    zoomButtonText: 'Reset Zoom',
                                    zoomButtonClass: 'reset-zoom btn btn-sm btn-outline-info',
                                },
                            }
                        }
                    }
                });
            });
    }

    function profitChart(startDate, endDate, type) {
        const ajaxResponse = fetch(`/reports/profit?from=${startDate}&to=${endDate}&type=${type}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                const labels = ajaxResponse.data.map(entry => entry.purchaseDate);
                const data = ajaxResponse.data.map(entry => entry.totalAmount);

                const ctx1 = document.getElementById('profitChart').getContext('2d');

                const existingChart = Chart.getChart(ctx1);

                if (existingChart) {
                    existingChart.destroy();
                }

                const salesChart = new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Profit',
                            data: data,


                            borderRadius: Number.MAX_VALUE,
                            borderWidth: 2,
                            borderSkipped: false,
                            pointStyle: 'circle',
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                            },
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                text: 'Revenue Chart',
                                display: true,
                            },
                            colors: {
                                enabled: false,
                                forceOverride: true
                            },
                            autocolors: {
                                repeat: 2,
                                offset: 5
                            },
                            crosshair: {
                                sync: {
                                    enabled: false,
                                    suppressTooltips: false
                                },
                                zoom: {
                                    enabled: true,
                                    zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
                                    zoomboxBorderColor: '#48F',
                                    zoomButtonText: 'Reset Zoom',
                                    zoomButtonClass: 'reset-zoom btn btn-sm btn-outline-info',
                                },
                            }
                        }
                    }
                });
            });
    }

    function salesChart(startDate, endDate) {
        const ajaxResponse = fetch(`/reports/statistical?from=${startDate}&to=${endDate}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                const labels = ajaxResponse.data.map(entry => entry.purchaseDate);
                const data = ajaxResponse.data.map(entry => entry.totalAmount);

                const ctx1 = document.getElementById('salesChart').getContext('2d');

                const existingChart = Chart.getChart(ctx1);

                if (existingChart) {
                    existingChart.destroy();
                }

                const salesChart = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Order',
                            data: data,


                            borderRadius: Number.MAX_VALUE,
                            borderWidth: 2,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                type: 'category',
                            },
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                text: 'Order history chart',
                                display: true,
                            },
                            colors: {
                                enabled: false,
                                forceOverride: true
                            },
                            autocolors: {
                                repeat: 2,
                                offset: 5
                            },
                            crosshair: {
                                sync: {
                                    enabled: false,
                                    suppressTooltips: false
                                },
                                zoom: {
                                    enabled: true,
                                    zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
                                    zoomboxBorderColor: '#48F',
                                    zoomButtonText: 'Reset Zoom',
                                    zoomButtonClass: 'reset-zoom btn btn-sm btn-outline-info',
                                },
                            }
                        }
                    }
                });
            });
    }

});
