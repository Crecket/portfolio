const routes = {
    Home: { path: "/" },
    Projects: { path: "/projects" },
    Contact: { path: "/contact" },
    Bunq: { path: "/bunq/:tab?", cleanUrl: "/bunq" },
    BunqImages: { path: "/bunq-images" },
    NotFound: { path: "/notfound", ignoreSitemap: true }
};

module.exports = routes;
