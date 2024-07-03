import React, { useEffect, useState } from 'react';

// Define a type for the parsed content
type ParsedContent = (string | JSX.Element)[];

const parseHTML = (content: string): ParsedContent => {
  const regex = /<(\w+)>|<\/(\w+)>|([^<>]+)/g;
  let match;
  const result: ParsedContent = [];
  const stack: { tag: string, children: ParsedContent }[] = [];

  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      // Opening tag
      const tag = match[1];
      stack.push({ tag, children: [] });
    } else if (match[2]) {
      // Closing tag
      const closed = stack.pop();
      if (closed) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(
            React.createElement(closed.tag, { key: stack.length }, closed.children)
          );
        } else {
          result.push(
            React.createElement(closed.tag, { key: result.length }, closed.children)
          );
        }
      }
    } else if (match[3]) {
      // Text content
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(match[3]);
      } else {
        result.push(match[3]);
      }
    }
  }

  return result;
};

interface TagRemoverProps {
  content: string;
}

const TagRemover: React.FC<TagRemoverProps> = ({ content }) => {
  const [parsedContent, setParsedContent] = useState<ParsedContent>([]);

  useEffect(() => {
    setParsedContent(parseHTML(content));
  }, [content]);

  return <>{parsedContent}</>;
};

export default TagRemover;
