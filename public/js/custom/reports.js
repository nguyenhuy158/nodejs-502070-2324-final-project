/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// profit chart
$(() => {
    // date range picker config
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
        // console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });

    // handle show chart 
    $('#daterange').on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('YYYY-MM-DD');
        const endDate = picker.endDate.format('YYYY-MM-DD');
        const type = $('#type').val();

        customerChart(startDate, endDate);
        profitChart(startDate, endDate, type);
        salesChart(startDate, endDate);
    });
    customerChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
    profitChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), $('#type').val());
    salesChart(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));

    const options = {
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
                display: true,
                text: 'Profit Chart'
            },
            colors: {
                enabled: false,
                forceOverride: true
            },
        }
    };

    function customerChart(startDate, endDate) {
        const ajaxResponse = fetch(`/reports/customer?from=${startDate}&to=${endDate}&type=${type}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                // Extract relevant data for the chart
                const labels = ajaxResponse.data.map(entry => entry.purchaseDate);
                const data = ajaxResponse.data.map(entry => entry.totalAmount);

                // Render the chart
                const ctx1 = document.getElementById('customerChart').getContext('2d');

                // Get the existing chart instance
                const existingChart = Chart.getChart(ctx1);

                // If there's an existing chart, destroy it
                if (existingChart) {
                    existingChart.destroy();
                }

                const salesChart = new Chart(ctx1, {
                    type: 'bubble',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Customer',
                            data: data,
                            // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            // borderColor: 'rgba(75, 192, 192, 1)',
                            // borderWidth: 1
                            borderRadius: Number.MAX_VALUE,
                            borderWidth: 2,
                            borderSkipped: false,
                            pointStyle: 'circle',
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }]
                    },
                    options: options
                });
            });
    }

    function profitChart(startDate, endDate, type) {
        const ajaxResponse = fetch(`/reports/profit?from=${startDate}&to=${endDate}&type=${type}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                // Extract relevant data for the chart
                const labels = ajaxResponse.data.map(entry => entry.purchaseDate);
                const data = ajaxResponse.data.map(entry => entry.totalAmount);

                // Render the chart
                const ctx1 = document.getElementById('profitChart').getContext('2d');

                // Get the existing chart instance
                const existingChart = Chart.getChart(ctx1);

                // If there's an existing chart, destroy it
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
                            // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            // borderColor: 'rgba(75, 192, 192, 1)',
                            // borderWidth: 1
                            borderRadius: Number.MAX_VALUE,
                            borderWidth: 2,
                            borderSkipped: false,
                            pointStyle: 'circle',
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }]
                    },
                    options: options
                });
            });
    }

    function salesChart(startDate, endDate) {
        const ajaxResponse = fetch(`/reports/statistical?from=${startDate}&to=${endDate}`)
            .then(response => response.json())
            .then(ajaxResponse => {

                // Extract relevant data for the chart
                const labels = ajaxResponse.data.map(entry => entry.purchaseDate);
                const data = ajaxResponse.data.map(entry => entry.totalAmount);

                // Render the chart
                const ctx1 = document.getElementById('salesChart').getContext('2d');

                // Get the existing chart instance
                const existingChart = Chart.getChart(ctx1);

                // If there's an existing chart, destroy it
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
                            // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            // borderColor: 'rgba(75, 192, 192, 1)',
                            // borderWidth: 1
                            borderRadius: Number.MAX_VALUE,
                            borderWidth: 2,
                            borderSkipped: false,
                        }]
                    },
                    options: options
                });
            });
    }

});
