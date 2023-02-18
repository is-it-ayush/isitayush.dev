import {defineDocumentType, makeSource, defineNestedType} from "@contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Entry = defineDocumentType(() => ({
    name: "Entry",
    filePathPattern: `**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {type: "string", required: true, description: "The title of the post"},
        publishedAt: {type: "date", required: true, description: "The date the post was published"},
        summary: {type: "string", required: true, description: "A short summary of the post"},
        image: {type: "string", required: false, description: "The main image of the post"},
        tags: {type: "list", required: false, description: "The tags of the post", of: {type: "string"}},
    },
    computedFields: {
        slug: {
            type: "string",
            resolve: doc => `/blog/${doc._raw.flattenedPath.toLowerCase().replace(/\s+/g, "-")}`,
        },
    },
}));

export default makeSource({
    contentDirPath: "content",
    documentTypes: [Entry],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [
                rehypePrettyCode,
                {
                    theme: "vitesse-dark",
                    onVisitLine(node) {
                        // Prevent lines from collapsing in `display: grid` mode, and allow empty
                        // lines to be copy/pasted
                        if (node.children.length === 0) {
                            node.children = [{type: "text", value: " "}];
                        }
                    },
                    onVisitHighlightedLine(node) {
                        node.properties.className.push("line--highlighted");
                    },
                    onVisitHighlightedWord(node) {
                        node.properties.className = ["word--highlighted"];
                    },
                },
            ],
            [
                rehypeAutolinkHeadings,
                {
                    properties: {
                        className: ["anchor"],
                    },
                },
            ],
        ],
    },
});
