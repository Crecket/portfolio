const routes = {
    Home: { path: "/" },
    Projects: { path: "/projects" },
    // Wallet: { path: "/wallet" },
    Contact: { path: "/contact" },
    Bunq: {
        path: "/bunq/:tab?",
        cleanUrl: "/bunq",
        subPaths: ["/invoices", "/payments", "/combined", "/together", "/predictions", "/images"]
    },
    NotFound: { path: "/notfound", ignoreSitemap: true }
};

module.exports = routes;
