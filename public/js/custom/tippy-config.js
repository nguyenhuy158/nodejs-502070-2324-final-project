$(() => {
    tippy("button:has(.bx.bx-search)", {
        content: "Search products",
    });
    tippy("a:has(.bx.bxs-dashboard)", {
        content: "Dashboard",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-store-alt)", {
        content: "Manager products",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-analyse)", {
        content: "Checkouts",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-money)", {
        content: "Manager orders",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-group)", {
        content: "Manager customers",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-id-card)", {
        content: "Manager salespeople",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-message-square-dots)", {
        content: "Manager tickets",
        placement: 'right',
    });
    tippy("a:has(.bx.bx-cog)", {
        content: "Settings",
        placement: 'right',
    });
    tippy(".profile", {
        content: "Profiles",
        placement: 'bottom',
    });
    tippy(".logout", {
        content: "Logout",
    });
});