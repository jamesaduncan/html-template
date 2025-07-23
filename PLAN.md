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
- [x] Implement constructor with template parsing
- [x] Set up template caching mechanism
- [x] Create basic render method structure

#### Phase 2: Data Source Handling ✓
- [x] Implement microdata extraction
  - Handle nested itemscope as nested objects
  - Multiple itemprop values become arrays
  - Extract @type, @id, @context
- [x] Implement form data extraction
  - Support dot notation (e.g., "person.name")
  - Handle array notation (e.g., "items[0].title", "items[].title")
- [x] Implement mixed array handling
  - Extract data from DOM elements first
  - Then render all items

#### Phase 3: Basic Rendering ✓
- [x] Implement text content binding
- [x] Implement attribute templating (`${variable}`)
- [x] Handle special elements:
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

#### Phase 4: Array Support ✓
- [x] Detect `itemprop="property[]"` syntax
- [x] Clone elements for each array item
- [x] Strip `[]` from final output

#### Phase 5: Nested Objects ✓
- [x] Process itemscope boundaries
- [x] Recursive rendering for nested structures
- [x] Maintain proper context for nested data

#### Phase 6: Type Matching ✓
- [x] Match templates by itemtype to data @type
- [x] Use first matching template
- [x] Allow rendering without selector when using types

#### Phase 7: Constraint System ✓
- [x] Implement data-scope (shorthand for property matching)
- [x] Implement data-constraint expression parser
- [x] Support operators: ==, !=, <, >, <=, >=, &&, ||, !
- [x] Evaluate constraints in current context

#### Phase 8: Reference Resolution ✓
- [x] Implement @id lookups
- [x] Handle scope attributes
- [x] Resolve #id references within data context

#### Phase 9: Advanced Features ✓
- [x] Generate itemid from id attributes using document.baseURI
- [x] Console warnings for:
  - Missing properties
  - Invalid constraints
  - Type mismatches

#### Phase 10: Testing ✓
- [x] Create comprehensive test suite in tests/index.html
- [x] Test all data source types
- [x] Test constraint evaluation
- [x] Test error cases

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
- ✓ Core HTMLTemplate class implemented
- ✓ All major features implemented:
  - ✓ Template parsing and caching
  - ✓ Basic data binding
  - ✓ Array handling with [] notation stripping
  - ✓ Nested object support
  - ✓ Attribute templating
  - ✓ Special element handling (all 18+ types)
  - ✓ Microdata type matching
  - ✓ Constraint system (data-scope, data-constraint)
  - ✓ Reference resolution (@id)
  - ✓ Multiple data source support (objects, microdata, forms)
  - ✓ itemid generation from id attributes
- ✓ Comprehensive test suite created
- ✓ All tests passing!

## Bug Fixes Completed
- ✓ Test 2: Fixed array handling with proper structure checks
- ✓ Test 5: Added visible attributes for checkbox/select elements
- ✓ Test 6, 10: Fixed microdata parsing to populate names correctly
- ✓ Test 7: Type matching works correctly with mixed arrays
- ✓ Test 8: Fixed template parsing to only use root-level templates
  - Actions are filtered into Person's job lists via data-scope
  - Only People are rendered at the root level
- ✓ Test 9: Reference resolution with data-constraint working
- ✓ Test 11: Fixed form extraction by prioritizing form handler over microdata
  - Form data with dot notation and array syntax working correctly

## Implementation Complete! 🎉

The HTMLTemplate library is now fully implemented with all features working as specified in the README. The library provides a powerful, microdata-based templating system that supports:

- Multiple data sources (JS objects, microdata elements, forms)
- Complex constraint-based filtering
- Type-aware rendering
- Nested data structures
- Array handling
- Special element support

All 11 tests are passing successfully!

## Technical Decisions
- Use ES modules (no build step required)
- Cache parsed templates for performance
- Console.warn for error cases
- Use DocumentFragment for efficient DOM manipulation
- Sanitize user data to prevent XSS