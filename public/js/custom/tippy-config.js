/* eslint-disable no-undef */
$(() => {
    tippy(".side-dashboard-btn", {
        content: "Dashboard",
        placement: 'right',
    });

    tippy(".side-product-btn", {
        content: "Manager products",
        placement: 'right',
    });
    tippy(".side-checkout-btn", {
        content: "Checkouts",
        placement: 'right',
    });
    tippy(".side-order-btn", {
        content: "Manager orders",
        placement: 'right',
    });
    tippy(".side-customer-btn", {
        content: "Manager customers",
        placement: 'right',
    });
    tippy(".side-sale-btn", {
        content: "Manager salespeople",
        placement: 'right',
    });
    tippy(".side-report-btn", {
        content: "Report",
        placement: 'right',
    });
    tippy(".profile", {
        content: "Profiles",
        placement: 'bottom',
    });
    tippy(".side-lockout-btn", {
        content: "Logout",
    });
    tippy(".theme-toggle", {
        content: "Dark mode toggle",
    });


    // orders
    $(document).on('mouseenter', '.print-btn', function () {
        tippy(this, {
            content: "Print order",
        });
    });
    $(document).on('mouseenter', '.view-order-btn', function () {
        tippy(this, {
            content: "View order detail",
        });
    });
    // datatables
    $(document).on('mouseenter', '.reload-btn', function () {
        tippy(this, {
            content: "Reload",
        });
    });
    $(document).on('mouseenter', '.add-salespeople-btn', function () {
        tippy(this, {
            content: "Add salespeople",
        });
    });
    $(document).on('mouseenter', '.options-btn', function () {
        tippy(this, {
            content: "Options",
        });
    });
    // products
    $(document).on('mouseenter', '.view-product-btn', function () {
        tippy(this, {
            content: "View product detail",
        });
    });
    $(document).on('mouseenter', '.add-to-cart-btn', function () {
        tippy(this, {
            content: "Add product to cart",
        });
    });
    $(document).on('mouseenter', '.edit-product-btn', function () {
        tippy(this, {
            content: "Edit product",
        });
    });
    $(document).on('mouseenter', '.delete-product-btn', function () {
        tippy(this, {
            content: "Delete product",
        });
    });
    // salespeople
    $(document).on('mouseenter', '.view-user-btn', function () {
        tippy(this, {
            content: "View account detail",
        });
    });
    $(document).on('mouseenter', '.edit-user-btn', function () {
        tippy(this, {
            content: "Edit account detail",
        });
    });
    $(document).on('mouseenter', '.delete-user-btn', function () {
        tippy(this, {
            content: "Delete account detail",
        });
    });
    $(document).on('mouseenter', '.lock-user-btn', function () {
        tippy(this, {
            content: "Lock account detail",
        });
    });
    $(document).on('mouseenter', '.unlock-user-btn', function () {
        tippy(this, {
            content: "Unlock account detail",
        });
    });
    $(document).on('mouseenter', '.resent-user-btn', function () {
        tippy(this, {
            content: "Resent link 1 minute",
        });
    });
    // customer
    $(document).on('mouseenter', '.view-customer-btn', function () {
        tippy(this, {
            content: "View customer detail",
        });
    });
    $(document).on('mouseenter', '.update-customer-btn', function () {
        tippy(this, {
            content: "Edit customer",
        });
    });
    $(document).on('mouseenter', '.history-customer-btn', function () {
        tippy(this, {
            content: "View history purchase of customer",
        });
    });
});