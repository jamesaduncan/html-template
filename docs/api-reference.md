# API Reference

## Class: HTMLTemplate

The main class for creating and rendering templates.

### Constructor

```javascript
new HTMLTemplate(templateElement, selector)
```

Creates a new HTMLTemplate instance.

#### Parameters

- **templateElement** `HTMLTemplateElement` (required) - The HTML template element to use
- **selector** `string` (optional) - CSS selector to find the root element within the template

#### Throws

- `Error` - If templateElement is not an HTMLTemplateElement

#### Example

```javascript
// Basic usage
const template = new HTMLTemplate(document.getElementById('my-template'));

// With selector
const template = new HTMLTemplate(
    document.getElementById('my-template'), 
    '.content'
);
```

### Methods

#### render(data)

Renders data using the template.

##### Parameters

- **data** `Object|Array|Element|HTMLFormElement` - The data to render

##### Returns

- `Element|Element[]` - Rendered DOM element(s). Returns an array when input is an array.

##### Example

```javascript
// Render single object
const element = template.render({
    name: "John Doe",
    email: "john@example.com"
});

// Render array
const elements = template.render([
    { name: "John" },
    { name: "Jane" }
]);

// Render from DOM element
const sourceElement = document.querySelector('[itemscope]');
const rendered = template.render(sourceElement);

// Render from form
const form = document.getElementById('my-form');
const formRendered = template.render(form);
```

## Data Source Types

### JavaScript Objects

Standard JavaScript objects with properties matching `itemprop` attributes:

```javascript
template.render({
    title: "Hello",
    description: "World",
    tags: ["one", "two", "three"]
});
```

### JavaScript Arrays

Arrays of objects for rendering multiple items:

```javascript
template.render([
    { name: "Item 1", value: 10 },
    { name: "Item 2", value: 20 },
    { name: "Item 3", value: 30 }
]);
```

### DOM Elements with Microdata

Elements containing microdata attributes:

```javascript
// Source HTML
<div itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">Jane Doe</span>
    <span itemprop="email">jane@example.com</span>
</div>

// Usage
const sourceElement = document.querySelector('[itemscope]');
const rendered = template.render(sourceElement);
```

### HTML Forms

Forms with automatic data extraction:

```javascript
// Form HTML
<form id="person-form">
    <input name="name" value="John Doe">
    <input name="email" value="john@example.com">
    <input name="address.street" value="123 Main St">
    <input name="address.city" value="Anytown">
</form>

// Usage
const form = document.getElementById('person-form');
const rendered = template.render(form);
// Extracts: {
//   name: "John Doe",
//   email: "john@example.com", 
//   address: {
//     street: "123 Main St",
//     city: "Anytown"
//   }
// }
```

## Type System

### Schema.org Type Matching

Templates can automatically match based on Schema.org types:

```javascript
// Template with type
<div itemscope itemtype="https://schema.org/Person">
    <h1 itemprop="name"></h1>
</div>

// Data with @type
template.render({
    "@type": "Person",
    "@context": "https://schema.org",
    "name": "John Doe"
});
```

### Type Resolution Rules

1. **@type requires @context** - Data with `@type` but no `@context` is treated as untyped
2. If data has valid `@type` and `@context`, and template has matching `itemtype`, they are paired
3. First matching template wins when multiple templates exist
4. Untyped templates match untyped data
5. Templates with types only match data with correct types

**Important:** Always include both `@type` and `@context` together:
```javascript
// ✅ Correct
{
    "@type": "Person",
    "@context": "https://schema.org",
    "name": "John Doe"
}

// ❌ Incorrect - @type without @context
{
    "@type": "Person",
    "name": "John Doe"
}
```

## Data Extraction

### Microdata Extraction Rules

When extracting from DOM elements:

1. `itemtype` → `@type` and `@context`
2. `id` attribute → `@id`
3. Nested `itemscope` → nested objects
4. Multiple same `itemprop` → arrays
5. Text content is trimmed

### Form Data Extraction Rules

1. Dot notation creates nested objects: `person.name` → `{ person: { name: "value" } }`
2. Array notation creates arrays: `items[]` → `{ items: ["value1", "value2"] }`
3. Numeric indices work: `items[0]` → `{ items: ["value"] }`
4. FormData is automatically processed

## Template Processing

### Processing Order

1. Template parsing and caching (on construction)
2. Data extraction from source
3. Template matching (for typed data)
4. Constraint evaluation
5. Attribute variable replacement
6. Content binding
7. Array expansion
8. Nested object processing
9. Special element handling
10. Microdata attribute cleanup

### Variable Replacement

Variables in attributes use `${name}` syntax:

```html
<a href="${url}" title="${description}">Link</a>
```

Only simple property names are supported (no expressions).

### Array Processing

1. Elements with `itemprop="property[]"` are cloned for each array item
2. The `[]` notation is removed from the final output
3. Parent element is preserved, only the array element is cloned

### Special Element Handling

| Element | Property Set | Notes |
|---------|-------------|-------|
| `<input type="text">` | `value` attribute | Also sets value property |
| `<input type="checkbox">` | `checked` property | Sets/removes `checked` attribute |
| `<input type="radio">` | `checked` property | Sets/removes `checked` attribute |
| `<textarea>` | `textContent` and `value` | Both are set |
| `<select>` | `selected` on options | Finds matching option by value |
| `<option>` | `selected` property | Sets/removes `selected` attribute |
| `<meta>` | `content` attribute | For metadata |
| `<img>` | `src` attribute | For images |
| `<audio>`, `<video>` | `src` attribute | For media |
| `<time>` | `datetime` attribute | For temporal data |
| `<output>` | `value` property | For form output |
| Others | `textContent` | Default behavior |

## Error Handling

### Console Warnings

HTMLTemplate logs warnings for:
- Missing properties in data
- Type mismatches
- Invalid constraint expressions
- Non-array data for array properties

### Error Recovery

- Missing properties are skipped (element remains empty)
- Invalid constraints evaluate to `false`
- Type mismatches prevent rendering (returns `null`)
- Malformed templates may produce unexpected results

## Performance Considerations

### Template Caching

Templates are parsed once during construction and cached:
- DOM traversal happens once
- Template structure is analyzed and stored
- Subsequent renders reuse the cached structure

### Best Practices

1. Create HTMLTemplate instances once and reuse them
2. Use type matching for better performance with mixed data
3. Minimize template complexity for faster parsing
4. Use `data-scope` instead of complex constraints when possible

## Limitations

1. No computed properties or expressions in templates
2. No conditional rendering (use constraints instead)
3. No template inheritance or composition
4. Variables in attributes support only simple property names
5. No built-in sanitization (sanitize data before rendering)