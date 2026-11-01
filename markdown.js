/* AETHER AI | js/markdown.js
   Turns the AI reply text into formatted HTML.
   Copyright (c) 2026 Parvez. All rights reserved. */

function md(s) {
  const B = [];
  s = esc(s).replace(/```(\w*)\n?([\s\S]*?)(```|$)/g, (m, l, c) => {
    B.push('<pre><code>' + c + '</code></pre>');
    return '\x01' + (B.length - 1) + '\x01';
  });
  s = s
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
    .replace(/^### (.*)$/gm, '<h4>$1</h4>')
    .replace(/^#{1,2} (.*)$/gm, '<h3>$1</h3>')
    .replace(
      /^(?:[-*] .*(?:\n|$))+/gm,
      (m) =>
        '</p><ul>' +
        m
          .trim()
          .split('\n')
          .map((l) => '<li>' + l.slice(2) + '</li>')
          .join('') +
        '</ul><p>',
    )
    .replace(
      /^(?:\d+\. .*(?:\n|$))+/gm,
      (m) =>
        '</p><ol>' +
        m
          .trim()
          .split('\n')
          .map((l) => '<li>' + l.replace(/^\d+\. /, '') + '</li>')
          .join('') +
        '</ol><p>',
    )
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');
  return '<p>' + s.replace(/\x01(\d+)\x01/g, (m, i) => B[i]) + '</p>';
}
