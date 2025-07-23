# Data Sources Guide

HTMLTemplate supports multiple data sources, allowing you to render templates from various inputs.

## JavaScript Objects

The most common data source is plain JavaScript objects.

### Simple Objects

```javascript
const data = {
    title: "Welcome",
    message: "Hello, World!",
    timestamp: "2024-01-15T10:30:00Z"
};

const element = template.render(data);
```

### Nested Objects

```javascript
const data = {
    product: {
        name: "Laptop",
        specs: {
            cpu: "Intel i7",
            ram: "16GB",
            storage: "512GB SSD"
        }
    }
};
```

### Objects with Arrays

```javascript
const data = {
    shoppingCart: {
        items: [
            { name: "Book", price: 15.99, quantity: 2 },
            { name: "Pen", price: 1.99, quantity: 5 }
        ],
        total: 41.93
    }
};
```

### Schema.org Typed Objects

Include `@type` and `@context` for type-based template matching:

```javascript
const data = {
    "@type": "Person",
    "@context": "https://schema.org",
    "@id": "john-doe",
    "name": "John Doe",
    "email": "john@example.com",
    "jobTitle": "Software Engineer"
};
```

## JavaScript Arrays

Render multiple items using arrays.

### Array of Simple Objects

```javascript
const data = [
    { name: "Item 1", value: 100 },
    { name: "Item 2", value: 200 },
    { name: "Item 3", value: 300 }
];

const elements = template.render(data); // Returns array of elements
```

### Array of Typed Objects

```javascript
const data = [
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "name": "Alice"
    },
    {
        "@type": "Organization",
        "@context": "https://schema.org",
        "name": "Acme Corp"
    }
];
```

### Mixed Type Arrays

Different types can coexist in arrays:

```javascript
const data = [
    {
        "@type": "BlogPosting",
        "@context": "https://schema.org",
        "headline": "New Product Launch",
        "datePublished": "2024-01-15"
    },
    {
        "@type": "NewsArticle",
        "@context": "https://schema.org",
        "headline": "Breaking News",
        "datePublished": "2024-01-16"
    }
];
```

## DOM Elements with Microdata

Extract data from existing HTML with microdata attributes.

### Single Element

```html
<!-- Source HTML -->
<div id="person-data" itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">Jane Smith</span>
    <span itemprop="email">jane@example.com</span>
    <div itemprop="address" itemscope>
        <span itemprop="streetAddress">123 Main St</span>
        <span itemprop="addressLocality">Boston</span>
        <span itemprop="addressRegion">MA</span>
    </div>
</div>

<script>
// Extract and render
const sourceElement = document.getElementById('person-data');
const rendered = template.render(sourceElement);
</script>
```

### List Elements

```html
<!-- Source HTML -->
<ul id="people-list">
    <li itemscope itemtype="https://schema.org/Person">
        <span itemprop="name">John Doe</span>
        <span itemprop="email">john@example.com</span>
    </li>
    <li itemscope itemtype="https://schema.org/Person">
        <span itemprop="name">Jane Doe</span>
        <span itemprop="email">jane@example.com</span>
    </li>
</ul>

<script>
// Extract from list
const list = document.getElementById('people-list');
const elements = template.render(list); // Returns array
</script>
```

### Extraction Rules

1. **itemtype** becomes `@type` and `@context`
2. **id** attribute becomes `@id`
3. **itemprop** values become properties
4. Nested **itemscope** creates nested objects
5. Multiple elements with same **itemprop** create arrays
6. Text content is trimmed automatically

### Complex Microdata Example

```html
<article id="blog-post" 
         itemscope 
         itemtype="https://schema.org/BlogPosting">
    <h1 itemprop="headline">Understanding Microdata</h1>
    
    <div itemprop="author" 
         itemscope 
         itemtype="https://schema.org/Person">
        <span itemprop="name">Dr. Sarah Johnson</span>
        <span itemprop="email">sarah@university.edu</span>
    </div>
    
    <time itemprop="datePublished" 
          datetime="2024-01-15">January 15, 2024</time>
    
    <div itemprop="articleBody">
        <p>Microdata provides a way to label content...</p>
    </div>
    
    <!-- Multiple values create array -->
    <meta itemprop="keywords" content="microdata">
    <meta itemprop="keywords" content="structured data">
    <meta itemprop="keywords" content="SEO">
</article>
```

Extracted data:
```javascript
{
    "@type": "BlogPosting",
    "@context": "https://schema.org",
    "@id": "blog-post",
    "headline": "Understanding Microdata",
    "author": {
        "@type": "Person",
        "@context": "https://schema.org",
        "name": "Dr. Sarah Johnson",
        "email": "sarah@university.edu"
    },
    "datePublished": "January 15, 2024",
    "articleBody": "Microdata provides a way to label content...",
    "keywords": ["microdata", "structured data", "SEO"]
}
```

## HTML Forms

Extract data from forms with automatic handling of nested properties and arrays.

### Basic Form

```html
<form id="contact-form">
    <input name="name" value="John Doe">
    <input name="email" value="john@example.com">
    <textarea name="message">Hello!</textarea>
    <select name="category">
        <option value="support" selected>Support</option>
        <option value="sales">Sales</option>
    </select>
</form>

<script>
const form = document.getElementById('contact-form');
const data = template.render(form);
// Result: {
//   name: "John Doe",
//   email: "john@example.com",
//   message: "Hello!",
//   category: "support"
// }
</script>
```

### Nested Properties with Dot Notation

```html
<form id="user-form">
    <input name="user.firstName" value="Jane">
    <input name="user.lastName" value="Smith">
    <input name="user.contact.email" value="jane@example.com">
    <input name="user.contact.phone" value="555-1234">
</form>

<script>
const form = document.getElementById('user-form');
const data = template.render(form);
// Result: {
//   user: {
//     firstName: "Jane",
//     lastName: "Smith",
//     contact: {
//       email: "jane@example.com",
//       phone: "555-1234"
//     }
//   }
// }
</script>
```

### Array Notation

```html
<form id="items-form">
    <!-- Using [] for arrays -->
    <input name="tags[]" value="javascript">
    <input name="tags[]" value="html">
    <input name="tags[]" value="css">
    
    <!-- Using numeric indices -->
    <input name="items[0].name" value="Product A">
    <input name="items[0].price" value="10.99">
    <input name="items[1].name" value="Product B">
    <input name="items[1].price" value="20.99">
</form>

<script>
const form = document.getElementById('items-form');
const data = template.render(form);
// Result: {
//   tags: ["javascript", "html", "css"],
//   items: [
//     { name: "Product A", price: "10.99" },
//     { name: "Product B", price: "20.99" }
//   ]
// }
</script>
```

### Complex Form Example

```html
<form id="order-form">
    <!-- Customer info -->
    <fieldset>
        <legend>Customer Information</legend>
        <input name="customer.name" placeholder="Full Name">
        <input name="customer.email" type="email" placeholder="Email">
        <input name="customer.phone" type="tel" placeholder="Phone">
    </fieldset>
    
    <!-- Shipping address -->
    <fieldset>
        <legend>Shipping Address</legend>
        <input name="shipping.street" placeholder="Street Address">
        <input name="shipping.city" placeholder="City">
        <input name="shipping.state" placeholder="State">
        <input name="shipping.zip" placeholder="ZIP Code">
    </fieldset>
    
    <!-- Order items -->
    <fieldset>
        <legend>Items</legend>
        <div class="item">
            <input name="items[0].product" value="Widget">
            <input name="items[0].quantity" type="number" value="2">
            <input name="items[0].price" type="number" value="9.99">
        </div>
        <div class="item">
            <input name="items[1].product" value="Gadget">
            <input name="items[1].quantity" type="number" value="1">
            <input name="items[1].price" type="number" value="19.99">
        </div>
    </fieldset>
    
    <!-- Options -->
    <fieldset>
        <legend>Options</legend>
        <label>
            <input type="checkbox" name="options.giftWrap" value="true">
            Gift Wrap
        </label>
        <label>
            <input type="checkbox" name="options.expressShipping" value="true" checked>
            Express Shipping
        </label>
    </fieldset>
</form>
```

### FormData Object

You can also pass a FormData object directly:

```javascript
const formData = new FormData(document.getElementById('my-form'));
const rendered = template.render(formData);
```

## Data Source Combination

You can combine data from multiple sources:

```javascript
// Extract from microdata
const microdataElement = document.querySelector('[itemscope]');
const extractedData = template.render(microdataElement);

// Enhance with additional data
const enhancedData = {
    ...extractedData,
    lastUpdated: new Date().toISOString(),
    status: "published"
};

// Render with enhanced data
const finalElement = template.render(enhancedData);
```

## Best Practices

1. **Choose the right source** - Use objects for programmatic data, forms for user input
2. **Validate data** - Ensure data matches template expectations
3. **Handle missing data** - Templates gracefully handle undefined properties
4. **Use type information** - Add @type for better template matching
5. **Test edge cases** - Empty arrays, null values, missing properties
6. **Consider performance** - Cache extracted data when reusing
7. **Maintain consistency** - Use consistent property naming across sources