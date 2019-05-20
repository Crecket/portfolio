import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

const absoluteUrl = path => `https://gregoryg.dev${path}`;

const getMetaTags = ({ title, description, url, contentType, published, updated, category, tags, image }) => {
    const metaTags = [
        { itemprop: "name", content: title },
        { itemprop: "description", content: description },
        { name: "description", content: description },
        { name: "twitter:title", content: `${title} | Gregory Goijaerts` },
        { name: "twitter:description", content: description },
        { name: "og:title", content: `${title} | gregoryg.dev` },
        { name: "og:type", content: contentType },
        { name: "og:url", content: url },
        { name: "og:description", content: description },
        { name: "og:site_name", content: "GregoryG.dev" },
        { name: "og:locale", content: "en_EN" }
    ];

    if (published) metaTags.push({ name: "article:published_time", content: published });
    if (updated) metaTags.push({ name: "article:modified_time", content: updated });
    if (category) metaTags.push({ name: "article:section", content: category });
    if (tags) metaTags.push({ name: "article:tag", content: tags });
    if (image) {
        metaTags.push({ itemprop: "image", content: absoluteUrl(image) });
        metaTags.push({ name: "twitter:image:src", content: absoluteUrl(image) });
        metaTags.push({ name: "og:image", content: absoluteUrl(image) });
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

const Seo = ({ schema, title, description, path, contentType, published, updated, category, tags, image }) => (
    <Helmet
        htmlAttributes={getHtmlAttributes({
            schema
        })}
        title={title}
        link={[{ rel: "canonical", href: absoluteUrl(path) }]}
        meta={getMetaTags({
            title,
            image,
            description,
            contentType,
            url: absoluteUrl(path),
            published,
            updated,
            category,
            tags
        })}
    />
);

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
