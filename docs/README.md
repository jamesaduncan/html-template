# HTMLTemplate Documentation

Welcome to the comprehensive documentation for HTMLTemplate, a microdata-based HTML templating system.

## 📚 Documentation Structure

### Core Documentation

1. **[Overview](overview.md)** - Introduction and key concepts
   - What is HTMLTemplate?
   - Key features and benefits
   - Philosophy and design principles
   - Quick example

2. **[Getting Started](getting-started.md)** - Quick start guide
   - Installation
   - Basic usage
   - Common patterns
   - Special elements

3. **[API Reference](api-reference.md)** - Detailed API documentation
   - Constructor and methods
   - Data source types
   - Type system
   - Error handling
   - Performance considerations

### In-Depth Guides

4. **[Template Syntax](template-syntax.md)** - Complete syntax guide
   - Microdata attributes (itemprop, itemscope, itemtype)
   - Array syntax
   - Attribute templating
   - Special elements
   - Constraints

5. **[Data Sources](data-sources.md)** - Working with different data
   - JavaScript objects and arrays
   - DOM elements with microdata
   - HTML forms
   - Data extraction rules

6. **[Advanced Features](advanced-features.md)** - Complex scenarios
   - Type-based template matching
   - Constraint system (data-scope, data-constraint)
   - ID references and relationships
   - Performance optimization
   - Edge cases

7. **[Examples](examples.md)** - Real-world implementations
   - E-commerce product catalog
   - Blog with comments
   - Task management dashboard
   - Social media feed
   - Dynamic form builder

## 🚀 Quick Links

- **New to HTMLTemplate?** Start with [Getting Started](getting-started.md)
- **Need API details?** Check the [API Reference](api-reference.md)
- **Building templates?** See [Template Syntax](template-syntax.md)
- **Working with complex data?** Read [Advanced Features](advanced-features.md)
- **Looking for inspiration?** Browse [Examples](examples.md)

## 💡 Key Concepts

### Microdata-Based
Uses standard HTML5 microdata attributes instead of custom syntax:
- `itemprop` - Property binding
- `itemscope` - Object boundaries
- `itemtype` - Schema.org types

### Multiple Data Sources
- Plain JavaScript objects
- Arrays for multiple items
- DOM elements with microdata
- HTML forms with automatic extraction

### Type-Aware Rendering
- Automatic template selection based on Schema.org types
- Polymorphic rendering without explicit template selection
- Type safety through schema matching

### Advanced Features
- Constraint-based filtering
- Reference resolution
- Array handling with element cloning
- Special element support

## 📖 How to Use This Documentation

1. **Sequential Learning**: Start with Overview → Getting Started → Template Syntax
2. **Reference**: Use API Reference for method signatures and parameters
3. **Problem Solving**: Check Examples for similar use cases
4. **Deep Dive**: Explore Advanced Features for complex scenarios

## 🤝 Contributing

Found an issue or want to improve the documentation? Contributions are welcome!

## 📄 License

This documentation is part of the HTMLTemplate project. See the main LICENSE file for details.