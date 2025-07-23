# Getting Started with HTMLTemplate

This guide will help you get up and running with HTMLTemplate quickly.

## Installation

HTMLTemplate is a single ES module file with no dependencies. Simply include it in your project:

```javascript
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';
```

Or use it directly in an HTML file:

```html
<script type="module">
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';
// Your code here
</script>
```

## Basic Usage

### 1. Create a Template

Templates use standard HTML with microdata attributes:

```html
<template id="my-template">
    <div itemscope>
        <h1 itemprop="title"></h1>
        <p itemprop="description"></p>
    </div>
</template>
```

### 2. Initialize HTMLTemplate

```javascript
const template = new HTMLTemplate(document.getElementById('my-template'));
```

### 3. Render with Data

```javascript
const element = template.render({
    title: "Hello World",
    description: "This is my first template"
});

document.body.appendChild(element);
```

## Key Concepts

### Microdata Attributes

HTMLTemplate uses three main microdata attributes:

- **`itemprop`**: Marks an element as a data binding point
- **`itemscope`**: Defines a new object scope
- **`itemtype`**: Specifies the Schema.org type

### Data Binding

Data is bound to elements with `itemprop` attributes:

```html
<!-- Template -->
<span itemprop="name"></span>

<!-- Data -->
{ name: "John Doe" }

<!-- Result -->
<span itemprop="name">John Doe</span>
```

### Arrays

Use `[]` notation for arrays (automatically stripped in output):

```html
<!-- Template -->
<ul>
    <li itemprop="items[]"></li>
</ul>

<!-- Data -->
{ items: ["Apple", "Banana", "Orange"] }

<!-- Result -->
<ul>
    <li itemprop="items">Apple</li>
    <li itemprop="items">Banana</li>
    <li itemprop="items">Orange</li>
</ul>
```

## Common Patterns

### Simple Object Rendering

```html
<template id="card">
    <div class="card" itemscope>
        <h2 itemprop="title"></h2>
        <p itemprop="content"></p>
        <time itemprop="date"></time>
    </div>
</template>

<script type="module">
import { HTMLTemplate } from 'https://jamesaduncan.github.io/html-template/index.mjs';

const template = new HTMLTemplate(document.getElementById('card'));
const card = template.render({
    title: "Important Update",
    content: "We've released a new version!",
    date: "2024-01-15"
});
</script>
```

### Nested Objects

```html
<template id="person">
    <div itemscope>
        <h1 itemprop="name"></h1>
        <div itemprop="address" itemscope>
            <p itemprop="street"></p>
            <p>
                <span itemprop="city"></span>,
                <span itemprop="state"></span>
                <span itemprop="zip"></span>
            </p>
        </div>
    </div>
</template>

<script type="module">
const template = new HTMLTemplate(document.getElementById('person'));
const element = template.render({
    name: "Jane Smith",
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345"
    }
});
</script>
```

### Lists of Objects

```html
<template id="task-list">
    <ul>
        <li itemprop="tasks[]" itemscope>
            <input type="checkbox" itemprop="completed">
            <span itemprop="title"></span>
            <small itemprop="priority"></small>
        </li>
    </ul>
</template>

<script type="module">
const template = new HTMLTemplate(document.getElementById('task-list'));
const list = template.render({
    tasks: [
        { title: "Write documentation", completed: true, priority: "high" },
        { title: "Review PR", completed: false, priority: "medium" },
        { title: "Deploy to production", completed: false, priority: "high" }
    ]
});
</script>
```

### Attribute Templating

Use `${variable}` syntax in attributes:

```html
<template id="link">
    <a href="${url}" title="${description}" itemprop="name"></a>
</template>

<script type="module">
const template = new HTMLTemplate(document.getElementById('link'));
const link = template.render({
    name: "HTMLTemplate Docs",
    url: "https://example.com/docs",
    description: "Read the full documentation"
});
</script>
```

## Special Elements

HTMLTemplate automatically handles special elements:

### Form Elements

```html
<!-- Inputs -->
<input type="text" itemprop="username">      <!-- Sets value -->
<input type="checkbox" itemprop="active">    <!-- Sets checked -->
<input type="radio" itemprop="option">       <!-- Sets checked -->

<!-- Textareas -->
<textarea itemprop="bio"></textarea>         <!-- Sets textContent and value -->

<!-- Selects -->
<select itemprop="country">                  <!-- Sets selected option -->
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
</select>
```

### Media Elements

```html
<!-- Images -->
<img itemprop="photo">                       <!-- Sets src -->

<!-- Audio/Video -->
<audio itemprop="soundtrack"></audio>        <!-- Sets src -->
<video itemprop="trailer"></video>           <!-- Sets src -->
```

### Metadata Elements

```html
<!-- Meta tags -->
<meta itemprop="keywords">                   <!-- Sets content -->

<!-- Time -->
<time itemprop="published"></time>           <!-- Sets datetime -->

<!-- Links -->
<link itemprop="canonical">                  <!-- Sets href -->
```

## Next Steps

- Read the [API Reference](api-reference.md) for detailed method documentation
- Learn about [Template Syntax](template-syntax.md) for advanced features
- Explore [Data Sources](data-sources.md) to work with forms and microdata
- Check out [Advanced Features](advanced-features.md) for constraints and type matching
- See [Examples](examples.md) for real-world use cases