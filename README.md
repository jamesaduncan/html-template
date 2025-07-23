# HTMLTemplate

A powerful, microdata-based HTML templating system that uses standard HTML5 attributes for data binding. HTMLTemplate bridges the gap between semantic HTML and dynamic data rendering without introducing new syntax or dependencies.

## ✨ Features

- **🏷️ Microdata-Based**: Uses standard HTML5 microdata attributes (`itemprop`, `itemtype`, `itemscope`)
- **📊 Multiple Data Sources**: Render from JavaScript objects, DOM elements, or HTML forms
- **🎯 Type-Aware**: Automatic template selection based on Schema.org types
- **🔄 Array Support**: Automatic element cloning for arrays with clean syntax
- **🎨 Attribute Templating**: Simple `${variable}` syntax for dynamic attributes
- **⚡ Zero Dependencies**: Pure JavaScript ES module, no build step required
- **♿ Accessible**: Semantic HTML ensures compatibility with screen readers and SEO

## 🚀 Quick Start

```javascript
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';

// Define your template
const template = new HTMLTemplate(document.getElementById('my-template'));

// Render with data
const element = template.render({
    name: "John Doe",
    email: "john@example.com",
    skills: ["JavaScript", "HTML", "CSS"]
});

document.body.appendChild(element);
```

```html
<template id="my-template">
    <div itemscope>
        <h1 itemprop="name"></h1>
        <p>Email: <a href="mailto:${email}" itemprop="email"></a></p>
        <ul>
            <li itemprop="skills[]"></li>
        </ul>
    </div>
</template>
```

## 📚 Documentation

Comprehensive documentation is available in the [docs](docs/) directory:

- **[Overview](docs/index.md)** - Introduction and key concepts
- **[Getting Started](docs/getting-started.md)** - Quick start guide and basic examples
- **[API Reference](docs/api-reference.md)** - Detailed API documentation
- **[Template Syntax](docs/template-syntax.md)** - Complete guide to template markup
- **[Data Sources](docs/data-sources.md)** - Working with different data sources
- **[Advanced Features](docs/advanced-features.md)** - Constraints, scoping, and type matching
- **[Examples](docs/examples.md)** - Real-world usage examples

## 💡 Why HTMLTemplate?

### Standards-Based
Unlike traditional templating engines that introduce custom syntax, HTMLTemplate uses standard HTML5 microdata attributes. Your templates are valid HTML that can be indexed by search engines and understood by machines.

### Progressive Enhancement
Templates work as static HTML and can be progressively enhanced with dynamic data. This ensures better SEO, graceful degradation, and improved accessibility.

### Type Safety
By leveraging Schema.org types, HTMLTemplate provides a form of "type safety" for your templates, automatically matching data to the correct template based on type information.

## 🛠️ Installation

HTMLTemplate is a single ES module file. Simply include it in your project:

```javascript
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';
```

Or use it directly in HTML:

```html
<script type="module">
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';
// Your code here
</script>
```

## 🧪 Testing

Run the test suite by serving the files with any HTTP server:

```bash
npx http-server -o /tests/
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Examples

### Simple Object Rendering

```html
<template id="card">
    <div itemscope class="card">
        <h2 itemprop="title"></h2>
        <p itemprop="description"></p>
        <time itemprop="date"></time>
    </div>
</template>
```

```javascript
const template = new HTMLTemplate(document.getElementById('card'));
const card = template.render({
    title: "Welcome to HTMLTemplate",
    description: "A microdata-based templating system",
    date: "2024-01-15"
});
```

### Type-Based Rendering

```html
<template id="mixed">
    <!-- Person template -->
    <div itemscope itemtype="https://schema.org/Person">
        <h2 itemprop="name"></h2>
        <p itemprop="jobTitle"></p>
    </div>
    
    <!-- Organization template -->
    <div itemscope itemtype="https://schema.org/Organization">
        <h2 itemprop="name"></h2>
        <p itemprop="description"></p>
    </div>
</template>
```

```javascript
const template = new HTMLTemplate(document.getElementById('mixed'));

// Automatically uses Person template
const person = template.render({
    "@type": "Person",
    "@context": "https://schema.org",
    "name": "Jane Doe",
    "jobTitle": "Software Engineer"
});

// Automatically uses Organization template  
const org = template.render({
    "@type": "Organization",
    "@context": "https://schema.org",
    "name": "Acme Corp",
    "description": "We make everything"
});
```

For more examples, see the [documentation](docs/examples.md).

---

<p align="center">Made with ❤️ using standard web technologies</p>