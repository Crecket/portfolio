const routes = {
    Home: { path: "/" },
    Projects: { path: "/projects" },
    Contact: { path: "/contact" },
    Eve: {
        path: "/eve/:tab?",
        cleanUrl: "/eve",
        subPaths: ["/hypernet"]
    },
    Bunq: {
        path: "/bunq/:tab?",
        cleanUrl: "/bunq",
        subPaths: ["/invoices", "/payments", "/combined", "/together", "/predictions", "/images"]
    },
    NotFound: { path: "/notfound", ignoreSitemap: true }
};

module.exports = routes;
