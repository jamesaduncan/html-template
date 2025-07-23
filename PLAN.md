# HTMLTemplate Implementation Plan

## Overview
This document outlines the implementation plan for the HTMLTemplate library, a microdata-based HTML templating system that supports multiple data sources and complex rendering scenarios.

## Core Requirements Summary

### Data Sources
1. **JavaScript Objects** - Standard JSON/JS objects with properties
2. **Microdata Elements** - DOM elements with itemscope/itemprop attributes
3. **HTML Forms** - Form data with dot notation for nested properties

### Key Features
- Template parsing with caching
- Array handling with element cloning (strips `[]` notation)
- Nested object support via itemscope
- Attribute templating with `${variable}` syntax
- Special element handling (input, select, meta)
- Microdata type matching with @type
- Constraint system (data-scope, data-constraint)
- ID reference resolution (@id lookups)

## Implementation Architecture

### Class Structure
```javascript
class HTMLTemplate {
    constructor(templateElement, selector) {
        // Parse and cache template
        // Store selector (optional)
        // Initialize template cache
    }
    
    render(data) {
        // Main entry point
        // Handles all three data source types
        // Returns element or array of elements
    }
    
    // Internal methods
    _parseTemplate()
    _extractDataFromSource(source)
    _extractFromMicrodata(element)
    _extractFromForm(form)
    _processElement(element, data, context)
    _processArray(element, arrayData, context)
    _evaluateConstraint(constraint, data, context)
    _resolveReference(ref, context)
    _replaceAttributeVariables(element, data)
    _setSpecialElementValue(element, value)
}
```

### Implementation Phases

#### Phase 1: Core Infrastructure ✓
- [x] Design class structure and method signatures
- [ ] Implement constructor with template parsing
- [ ] Set up template caching mechanism
- [ ] Create basic render method structure

#### Phase 2: Data Source Handling
- [ ] Implement microdata extraction
  - Handle nested itemscope as nested objects
  - Multiple itemprop values become arrays
  - Extract @type, @id, @context
- [ ] Implement form data extraction
  - Support dot notation (e.g., "person.name")
  - Handle array notation (e.g., "items[0].title", "items[].title")
- [ ] Implement mixed array handling
  - Extract data from DOM elements first
  - Then render all items

#### Phase 3: Basic Rendering
- [ ] Implement text content binding
- [ ] Implement attribute templating (`${variable}`)
- [ ] Handle special elements:
  - `<input>` → set value property
  - `<input type="checkbox">` → set checked property (boolean)
  - `<input type="radio">` → set checked property (boolean)
  - `<select>` → set selected on appropriate option
  - `<option>` → set selected property (boolean)
  - `<textarea>` → set BOTH textContent AND value property
  - `<output>` → set value property
  - `<meta>` → set content attribute
  - `<img>` → set src attribute
  - `<link>` → set href attribute
  - `<audio>`/`<video>`/`<source>` → set src attribute
  - `<object>` → set data attribute
  - `<embed>` → set src attribute
  - `<iframe>` → set src attribute
  - `<time>` → set datetime attribute
  - `<data>` → set value attribute
  - `<meter>`/`<progress>` → set value attribute

#### Phase 4: Array Support
- [ ] Detect `itemprop="property[]"` syntax
- [ ] Clone elements for each array item
- [ ] Strip `[]` from final output

#### Phase 5: Nested Objects
- [ ] Process itemscope boundaries
- [ ] Recursive rendering for nested structures
- [ ] Maintain proper context for nested data

#### Phase 6: Type Matching
- [ ] Match templates by itemtype to data @type
- [ ] Use first matching template
- [ ] Allow rendering without selector when using types

#### Phase 7: Constraint System
- [ ] Implement data-scope (shorthand for property matching)
- [ ] Implement data-constraint expression parser
- [ ] Support operators: ==, !=, <, >, <=, >=, &&, ||, !
- [ ] Evaluate constraints in current context

#### Phase 8: Reference Resolution
- [ ] Implement @id lookups
- [ ] Handle scope attributes
- [ ] Resolve #id references within data context

#### Phase 9: Advanced Features
- [ ] Generate itemid from id attributes using document.baseURI
- [ ] Console warnings for:
  - Missing properties
  - Invalid constraints
  - Type mismatches

#### Phase 10: Testing
- [ ] Create comprehensive test suite in tests/index.html
- [ ] Test all data source types
- [ ] Test constraint evaluation
- [ ] Test error cases

## Key Implementation Details

### Special Element Handling
The library needs to handle various HTML elements differently:

**Value-based elements** (set value property):
- `<input>` (text, number, email, etc.)
- `<textarea>` → set BOTH textContent AND value property
- `<output>`

**Boolean elements** (set checked/selected property):
- `<input type="checkbox">` → checked
- `<input type="radio">` → checked
- `<option>` → selected

**Attribute-based elements**:
- `<meta>` → content
- `<img>` → src
- `<link>` → href
- `<audio>`, `<video>`, `<source>` → src
- `<object>` → data
- `<embed>` → src
- `<iframe>` → src
- `<time>` → datetime
- `<data>` → value
- `<meter>`, `<progress>` → value

### Array Notation Handling
- Template: `<li itemprop="items[]"></li>`
- Output: `<li itemprop="items">value</li>` (no brackets)

### Microdata Parsing Rules
- Multiple same itemprop → array
- Nested itemscope → nested object
- id attribute → itemid with baseURI resolution

### Form Data Parsing
- "name" → `{name: "value"}`
- "person.name" → `{person: {name: "value"}}`
- "items[0].title" → `{items: [{title: "value"}]}`
- "items[].title" → auto-increment for multiple fields

### Constraint Evaluation
- `data-scope="agent"` → `data-constraint="agent==@id"`
- Support for complex expressions
- Evaluate in current rendering context

### Type Matching
- First matching itemtype wins
- Allows omitting selector parameter
- Works with arrays of typed objects

## Current Status
- ✓ Requirements gathered and clarified
- ✓ Implementation plan created
- 🔄 Starting core class implementation
- ⏳ Pending all other phases

## Next Steps
1. Implement core HTMLTemplate class structure
2. Add template parsing and caching
3. Implement data extraction for all three sources
4. Build rendering engine with all features
5. Create comprehensive test suite

## Open Questions
All questions have been resolved through clarification with the user.

## Technical Decisions
- Use ES modules (no build step required)
- Cache parsed templates for performance
- Console.warn for error cases
- Use DocumentFragment for efficient DOM manipulation
- Sanitize user data to prevent XSS