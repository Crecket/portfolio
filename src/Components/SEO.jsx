import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

const absoluteUrl = path => `https://gregoryg.dev${path}`;

const getMetaTags = options => {
    const { fullTitle, description, url, contentType, published, updated, category, tags, image } = options;

    const metaTags = [
        { name: "og:url", content: url },
        { name: "og:site_name", content: "GregoryG.dev" },
        { name: "og:locale", content: "en_EN" },
        { name: "profile:first_name", content: "Gregory" },
        { name: "profile:last_name", content: "Goijaerts" },
        { name: "profile:username", content: "Crecket" }
    ];

    if (contentType) metaTags.push({ name: "og:type", content: contentType });

    if (published) metaTags.push({ name: "article:published_time", content: published });
    if (updated) metaTags.push({ name: "article:modified_time", content: updated });
    if (category) metaTags.push({ name: "article:section", content: category });
    if (tags) metaTags.push({ name: "article:tag", content: tags });

    if (fullTitle) {
        metaTags.push({ name: "og:title", content: fullTitle });
        metaTags.push({ itemprop: "name", content: fullTitle });
        metaTags.push({ name: "twitter:title", content: fullTitle });
    }
    if (description) {
        metaTags.push({ name: "og:description", content: description });
        metaTags.push({ itemprop: "description", content: description });
        metaTags.push({ name: "description", content: description });
        metaTags.push({ name: "twitter:description", content: description });
    }
    if (image) {
        metaTags.push({ name: "og:image", content: absoluteUrl(image) });
        metaTags.push({ itemprop: "image", content: absoluteUrl(image) });
        metaTags.push({ name: "twitter:image:src", content: absoluteUrl(image) });
        metaTags.push({ name: "twitter:card", content: "summary_large_image" });
    } else {
        metaTags.push({ name: "twitter:card", content: "summary" });
    }

    return metaTags;
};

const getHtmlAttributes = ({ schema }) => {
    let result = {
        lang: "en"
    };
    if (schema) {
        result = {
            ...result,
            itemscope: undefined,
            itemtype: `http://schema.org/${schema}`
        };
    }
    return result;
};

getHtmlAttributes.propTypes = {
    schema: PropTypes.string
};

const Seo = ({ schema, title, description, path = "/", contentType, published, updated, category, tags, image }) => {
    const fullTitle = title ? `${title} - GregoryG.dev` : "GregoryG.dev";

    const htmlAttributes = getHtmlAttributes({
        schema
    });

    // get all meta tags
    const metaTags = getMetaTags({
        title,
        fullTitle,
        image,
        description,
        contentType,
        url: absoluteUrl(path),
        published,
        updated,
        category,
        tags
    });
    // render as component so nested meta tags don't overwrite the parent SEO component
    const metaTagComponents = metaTags.map((props, key) => <meta key={key} {...props} />);

    return (
        <Helmet
            htmlAttributes={htmlAttributes}
            title={fullTitle}
            link={[{ rel: "canonical", href: absoluteUrl(path) }]}
        >
            {metaTagComponents}
            <script type="application/ld+json">{`
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Gregory Goijaerts",
        "jobTitle": "Software Engineer",
        "url": "https://gregoryg.dev",
        "sameAs": [
            "https://www.linkedin.com/in/gregory-goijaerts/",
            "https://github.com/Crecket"
        ]
    }
`}</script>
        </Helmet>
    );
};

Seo.propTypes = {
    schema: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    path: PropTypes.string,
    contentType: PropTypes.string,
    published: PropTypes.string,
    updated: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.array,
    image: PropTypes.string
};

export default Seo;
