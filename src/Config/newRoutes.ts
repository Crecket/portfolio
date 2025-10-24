const newRoutes = {
    Home: { path: "/" },
    Projects: { path: "/projects" },
    Bunq: {
        path: "/bunq/:type?",
        cleanUrl: "/bunq",
        subPaths: ["/invoices", "/payments", "/combined", "/together", "/predictions", "/images"]
    },
    NotFound: { path: "/notfound", ignoreSitemap: true }
};

export default newRoutes;