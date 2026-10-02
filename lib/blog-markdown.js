const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

function renderMarkdown(content) {
  return sanitizeHtml(marked(content), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

module.exports = { renderMarkdown };
