# HTML Template API Specification

Version: 1.0.0

## Overview

HTML Template is a templating system that uses HTML5 microdata attributes (itemprop, itemtype, itemscope) for data binding. This specification defines the core API and behavior that implementations should follow regardless of programming language.

## Core Concepts

### 1. Template Definition

A template is an HTML fragment containing elements with microdata attributes that define data binding points.

**Microdata Attributes:**
- `itemprop` - Identifies a property to bind
- `itemscope` - Defines an object boundary
- `itemtype` - Specifies a Schema.org type constraint
- `itemid` - Unique identifier for the rendered item

**Template Attributes:**
- `data-scope` - Shorthand for `data-constraint` matching a property
- `data-constraint` - Expression for conditional rendering

### 2. Data Binding Syntax

- **Text Content**: Element text is replaced with the property value
- **Attribute Interpolation**: `${propertyName}` syntax in attributes
- **Array Notation**: `itemprop="propertyName[]"` indicates array handling

## API Methods

### Constructor/Initialization

```
HtmlTemplate(templateSource, [selector])
```

**Parameters:**
- `templateSource`: HTML element, string, or document containing the template
- `selector`: Optional CSS selector to identify the root element within the template

**Returns:** Template instance

**Behavior:**
- Parses the template and prepares it for rendering
- When selector is omitted and microdata types are present, automatically matches based on `@type`

### Primary Rendering Method

```
render(data) -> Element | Array<Element>
```

**Parameters:**
- `data`: Object, array of objects, or DOM element(s) to render

**Returns:**
- Single Element if data is an object
- Array of Elements if data is an array

**Behavior:**
1. Matches data properties to `itemprop` attributes
2. Handles nested objects via `itemscope`
3. Processes arrays by cloning template elements
4. Applies constraints and scopes
5. Generates `itemid` attributes using source element's base URI

### Rendering from DOM Elements

```
renderFromElement(sourceElement) -> Element | Array<Element>
```

**Parameters:**
- `sourceElement`: DOM element containing microdata to extract and render

**Returns:**
- Rendered element(s) based on extracted microdata

**Behavior:**
- Extracts microdata from source elements
- Preserves source element's base URI for `itemid` generation

## Data Processing Rules

### 1. Property Matching

Properties are matched to elements by:
1. Direct `itemprop` attribute matching
2. Nested object traversal with `itemscope`
3. Type matching when `itemtype` is specified

### 2. Value Assignment

**Standard Elements:**
- Text content is set as innerHTML

**Special Elements:**
- `<input>` - Sets `value` attribute
- `<select>` - Sets appropriate option as selected
- `<textarea>` - Sets text content
- `<meta>` - Sets `content` attribute
- `<img>` - Sets `src` attribute when itemprop matches
- `<a>` - Can set `href` via attribute interpolation
- `<input type="checkbox">` - Sets `checked` attribute for boolean values
- `<input type="radio">` - Sets `checked` for matching values

### 3. Array Processing

When `itemprop="property[]"` or data property is an array:
1. Clone the template element for each array item
2. Remove the `[]` suffix when processing each item
3. Maintain array order in rendered output

### 4. Attribute Interpolation

Pattern: `${propertyName}` in any attribute value

**Example:**
```html
<a href="${url}" title="${description}">Link</a>
```

### 5. Microdata Type Handling

When `@type` and `@context` are present in data:
1. Match elements with corresponding `itemtype`
2. Automatically determine rendering root
3. Apply Schema.org validation if configured

## Constraint System

### 1. Scope Constraints

`data-scope="propertyName"` - Element renders only when the specified property matches the current context's `@id`.

**Example:**
```html
<li itemtype="https://schema.org/Action" data-scope="agent">
```

### 2. Expression Constraints

`data-constraint="expression"` - Evaluates simple expressions for conditional rendering.

**Supported Operators:**
- `==` - Equality comparison
- `!=` - Inequality comparison
- `@id` - References current context's identifier

**Example:**
```html
<div data-constraint="status == 'active'">
<div data-constraint="agent == @id">
```

## Form Processing

### Form to Data Conversion

Forms can be used as data sources with special handling:

**Dot Notation:** Form fields with dots in names create nested objects
- `name="address.street"` → `{ address: { street: "value" } }`

**Array Handling:** Multiple inputs with same name create arrays
- Multiple `name="tags"` → `{ tags: ["value1", "value2"] }`

**Checkbox Arrays:** Checkboxes with `[]` suffix
- `name="options[]"` → Array of checked values

## Base URI Resolution

### itemid Generation Rules

The `itemid` attribute is used to reference the authoritative source of microdata. It is only added to rendered (non-authoritative) elements to indicate where the original data came from.

1. **Source Requirement**: Only generate `itemid` when rendering from existing microdata elements that have an `id` attribute
2. **Non-authoritative Only**: Never add `itemid` to the original/authoritative element itself
3. **Reference Format**: `itemid` contains a URI reference to the authoritative element
4. **Base URI**: Use the **source element's base URI**, not the rendering document's base URI
5. **Format**: `baseURI#id`

**Example:**
```html
<!-- Authoritative source at https://example.com/data/people.html -->
<li id="person123" itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">John Doe</span>
</li>

<!-- Rendered (non-authoritative) copy -->
<div itemscope itemtype="https://schema.org/Person" itemid="https://example.com/data/people.html#person123">
    <h1 itemprop="name">John Doe</h1>
</div>
```

**Key Points:**
- The source `<li>` has `id` but no `itemid` (it's authoritative)
- The rendered `<div>` has `itemid` pointing to the source (it's non-authoritative)
- This preserves semantic integrity and data lineage when rendering cross-document microdata

## Error Handling

Implementations should handle:

1. **Missing Properties**: Gracefully handle undefined properties
2. **Type Mismatches**: Convert or skip incompatible data types
3. **Invalid Templates**: Provide clear error messages
4. **Circular References**: Detect and prevent infinite loops

## Optional Features

### 1. Validation Modes

- **Strict**: Enforce Schema.org type constraints
- **Lenient**: Best-effort rendering

### 2. Caching

- Template compilation caching
- Rendered element caching

### 3. Custom Handlers

- Register custom element handlers
- Override default behavior for specific elements

## Implementation Notes

### Performance Considerations

1. Use document fragments for efficient DOM manipulation
2. Minimize template re-parsing
3. Cache compiled templates when possible
4. Batch DOM operations

### Security

1. Sanitize user-provided data to prevent XSS
2. Validate URLs in `href` and `src` attributes
3. Escape HTML entities in text content
4. Never execute arbitrary JavaScript from templates

## Compliance Levels

### Level 1: Core
- Basic property binding
- Text content replacement
- Attribute interpolation

### Level 2: Advanced
- Array handling
- Nested objects with itemscope
- Special element handling

### Level 3: Full
- Microdata type matching
- Constraint system
- Cross-document rendering
- Form processing

## Version History

- 1.0.0 - Initial specification