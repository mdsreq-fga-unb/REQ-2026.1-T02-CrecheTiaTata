const React = require('react');

function Heading({ as: Tag = 'h1', children, ...props }) {
  return React.createElement(Tag, props, children);
}

module.exports = Heading;
