# HTMLTemplate Documentation

## Overview

HTMLTemplate is a powerful, microdata-based HTML templating system that bridges the gap between semantic HTML and dynamic data rendering. It leverages HTML5 microdata attributes (`itemprop`, `itemtype`, `itemscope`) to create templates that are both machine-readable and human-maintainable.

## Key Features

### 1. **Microdata-Based Templating**
Uses standard HTML5 microdata attributes for data binding, making templates SEO-friendly and semantically meaningful.

### 2. **Multiple Data Sources**
- JavaScript objects and arrays
- DOM elements with microdata
- HTML forms with automatic data extraction

### 3. **Type-Aware Rendering**
Automatic template selection based on Schema.org types, enabling polymorphic rendering.

### 4. **Advanced Data Binding**
- Nested object support with `itemscope`
- Array handling with automatic element cloning
- Attribute templating with `${variable}` syntax
- Special element handling (inputs, selects, meta tags, etc.)

### 5. **Constraint System**
- Data scoping with `data-scope` attribute
- Complex constraint expressions with `data-constraint`
- Reference resolution between related data objects

### 6. **Zero Dependencies**
Pure JavaScript implementation with no external dependencies, using ES modules.

## Why HTMLTemplate?

### Semantic HTML First
Unlike traditional templating engines that use custom syntax, HTMLTemplate uses standard HTML5 microdata attributes. This means:
- Templates are valid HTML that can be indexed by search engines
- Templates provide structured data that machines can understand
- No new syntax to learn - just HTML with microdata

### Progressive Enhancement
Templates work as static HTML and can be progressively enhanced with dynamic data. This approach ensures:
- Better SEO as content is visible to crawlers
- Graceful degradation when JavaScript fails
- Improved accessibility with semantic markup

### Type Safety Through Schema.org
By leveraging Schema.org types, HTMLTemplate provides a form of "type safety" for your templates:
- Templates automatically match data based on type
- Prevents rendering mismatched data
- Self-documenting templates that describe their expected data

## Quick Example

```html
<template id="person-template">
    <div itemscope itemtype="https://schema.org/Person">
        <h1 itemprop="name"></h1>
        <p>Email: <a href="mailto:${email}" itemprop="email"></a></p>
        <ul>
            <li itemprop="skills[]"></li>
        </ul>
    </div>
</template>

<script type="module">
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';

const template = new HTMLTemplate(document.getElementById('person-template'));
const element = template.render({
    "@type": "Person",
    "@context": "https://schema.org",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "skills": ["JavaScript", "HTML", "CSS"]
});

document.body.appendChild(element);
</script>
```

## Philosophy

HTMLTemplate is built on these core principles:

1. **Standards-Based**: Use existing web standards rather than inventing new syntax
2. **Semantic**: Templates should be meaningful to both humans and machines
3. **Flexible**: Support multiple data sources and rendering patterns
4. **Simple**: Keep the API surface small and intuitive
5. **Powerful**: Enable complex use cases without complexity

## Browser Support

HTMLTemplate works in all modern browsers that support:
- ES6 modules
- Template elements
- Microdata attributes

No polyfills or transpilation required for modern browsers.

## License

This project is open source. See the LICENSE file for details.