# Advanced Features

This guide covers HTMLTemplate's advanced features for complex rendering scenarios.

## Type-Based Template Matching

### Overview

HTMLTemplate can automatically select templates based on Schema.org types, enabling polymorphic rendering without explicit template selection.

### Basic Type Matching

```html
<template id="multi-type">
    <!-- Person template -->
    <div itemscope itemtype="https://schema.org/Person" class="person">
        <h2 itemprop="name"></h2>
        <p itemprop="jobTitle"></p>
    </div>
    
    <!-- Organization template -->
    <div itemscope itemtype="https://schema.org/Organization" class="org">
        <h2 itemprop="name"></h2>
        <p>Founded: <span itemprop="foundingDate"></span></p>
    </div>
</template>

<script>
const template = new HTMLTemplate(document.getElementById('multi-type'));

// Renders using Person template
const person = template.render({
    "@type": "Person",
    "@context": "https://schema.org",
    "name": "Jane Doe",
    "jobTitle": "CEO"
});

// Renders using Organization template
const org = template.render({
    "@type": "Organization", 
    "@context": "https://schema.org",
    "name": "Acme Corp",
    "foundingDate": "1990"
});
</script>
```

### Mixed Type Arrays

```javascript
const mixedData = [
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "name": "John Developer"
    },
    {
        "@type": "Organization",
        "@context": "https://schema.org", 
        "name": "Tech Startup"
    },
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "name": "Jane Designer"
    }
];

// Each item renders with its matching template
const elements = template.render(mixedData);
```

### Type Matching Rules

1. First matching template wins
2. Exact type match required (no inheritance)
3. Untyped data won't match typed templates
4. Templates without types match any data

## Constraint System

### data-scope Attribute

The `data-scope` attribute creates filtered arrays based on property matching:

```html
<template>
    <div itemscope itemtype="https://schema.org/Person">
        <h1 itemprop="name"></h1>
        <h2>Assigned Tasks</h2>
        <ul>
            <!-- Only shows tasks where task.assignee matches person's @id -->
            <li data-scope="assignee">
                <span itemprop="title"></span>
                <span itemprop="status"></span>
            </li>
        </ul>
    </div>
</template>

<script>
// Data with relationships
const data = [
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "john",
        "name": "John Doe"
    },
    {
        "@type": "Task",
        "@context": "https://schema.org",
        "title": "Write documentation",
        "assignee": "#john",
        "status": "in-progress"
    },
    {
        "@type": "Task",
        "@context": "https://schema.org",
        "title": "Review code",
        "assignee": "#jane",
        "status": "pending"
    }
];

// Only John's tasks appear under his name
const rendered = template.render(data);
</script>
```

### data-constraint Attribute

Complex expressions for conditional rendering:

#### Comparison Operators

```html
<!-- Equality -->
<div data-constraint="status==active">Only shows if status is "active"</div>

<!-- Inequality -->
<div data-constraint="role!=admin">Shows for non-admin users</div>

<!-- Numeric comparisons -->
<div data-constraint="age>=18">Adult content</div>
<div data-constraint="price<100">Budget items</div>

<!-- Multiple conditions -->
<div data-constraint="age>=18 && status==active">Active adults</div>
<div data-constraint="role==admin || role==moderator">Staff only</div>
```

#### Reference Resolution

```html
<template>
    <article itemscope itemtype="https://schema.org/BlogPosting">
        <h1 itemprop="headline"></h1>
        
        <!-- Resolves author reference and displays name -->
        <p>By <span data-constraint="@id==author" itemprop="name"></span></p>
    </article>
</template>

<script>
const data = [
    {
        "@type": "BlogPosting",
        "@context": "https://schema.org",
        "headline": "Understanding Constraints",
        "author": "#jane-doe"
    },
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "jane-doe",
        "name": "Jane Doe"
    }
];
</script>
```

### Complex Constraint Examples

#### Project Management Dashboard

```html
<template>
    <!-- Project template -->
    <div itemscope itemtype="https://schema.org/Project">
        <h2 itemprop="name"></h2>
        
        <!-- Team members -->
        <section>
            <h3>Team</h3>
            <div data-scope="project" itemscope itemtype="https://schema.org/Person">
                <img itemprop="image" alt="${name}">
                <span itemprop="name"></span>
                <span itemprop="role"></span>
            </div>
        </section>
        
        <!-- Active tasks -->
        <section>
            <h3>Active Tasks</h3>
            <ul>
                <li data-constraint="project==@id && status!=completed">
                    <span itemprop="title"></span>
                    <progress itemprop="progress" max="100"></progress>
                </li>
            </ul>
        </section>
        
        <!-- Completed tasks -->
        <section>
            <h3>Completed Tasks</h3>
            <ul>
                <li data-constraint="project==@id && status==completed">
                    <s itemprop="title"></s>
                    <time itemprop="completedDate"></time>
                </li>
            </ul>
        </section>
    </div>
</template>
```

## ID References and Relationships

### Using @id for Relationships

```javascript
const data = [
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "alice",
        "name": "Alice Johnson",
        "worksFor": "#techcorp"
    },
    {
        "@type": "Organization",
        "@context": "https://schema.org",
        "@id": "techcorp",
        "name": "Tech Corporation",
        "ceo": "#alice"
    }
];
```

### Bidirectional References

```html
<template>
    <!-- Person with employer -->
    <div itemscope itemtype="https://schema.org/Person">
        <h2 itemprop="name"></h2>
        <p>Works at: 
            <span data-constraint="@id==worksFor" itemprop="name"></span>
        </p>
    </div>
    
    <!-- Organization with employees -->
    <div itemscope itemtype="https://schema.org/Organization">
        <h2 itemprop="name"></h2>
        <h3>Employees</h3>
        <ul>
            <li data-scope="worksFor" itemprop="name"></li>
        </ul>
    </div>
</template>
```

### Graph-Like Data Structures

```javascript
const socialGraph = [
    {
        "@type": "Person",
        "@id": "user1",
        "name": "User One",
        "follows": ["#user2", "#user3"]
    },
    {
        "@type": "Person", 
        "@id": "user2",
        "name": "User Two",
        "follows": ["#user1", "#user3"]
    },
    {
        "@type": "Person",
        "@id": "user3", 
        "name": "User Three",
        "follows": ["#user1"]
    }
];
```

## Advanced Array Handling

### Nested Arrays

```html
<template>
    <div itemscope>
        <h1 itemprop="storeName"></h1>
        <div itemprop="departments[]" itemscope>
            <h2 itemprop="name"></h2>
            <ul>
                <li itemprop="products[]" itemscope>
                    <span itemprop="name"></span>
                    <span itemprop="price"></span>
                </li>
            </ul>
        </div>
    </div>
</template>
```

### Array Filtering with Constraints

```html
<!-- Only show items matching criteria -->
<ul>
    <li itemprop="inventory[]" 
        data-constraint="inStock==true && price<50"
        itemscope>
        <span itemprop="name"></span>
        <span itemprop="price"></span>
    </li>
</ul>
```

### Dynamic Array Composition

```javascript
// Combine data from multiple sources
const allTasks = [...projectTasks, ...personalTasks, ...teamTasks];

// Filter and render based on complex criteria
const activeTasks = allTasks.filter(task => 
    task.status === 'active' && 
    task.priority > 3
);

template.render({ tasks: activeTasks });
```

## Performance Optimization

### Template Caching

Templates are parsed once and cached:

```javascript
// Good - reuse template instance
const template = new HTMLTemplate(element);
for (const item of largeDataset) {
    const rendered = template.render(item);
    container.appendChild(rendered);
}

// Avoid - creating new instances
for (const item of largeDataset) {
    const template = new HTMLTemplate(element); // Don't do this
    const rendered = template.render(item);
}
```

### Efficient Data Structures

```javascript
// Index data for faster lookups
const dataById = data.reduce((acc, item) => {
    if (item['@id']) {
        acc[item['@id']] = item;
    }
    return acc;
}, {});

// Pre-filter data when possible
const relevantData = data.filter(item => 
    item['@type'] === 'Person' && item.active
);
```

### Batch Rendering

```javascript
// Use DocumentFragment for better performance
const fragment = document.createDocumentFragment();
const elements = template.render(largeArray);

elements.forEach(el => fragment.appendChild(el));
container.appendChild(fragment); // Single DOM update
```

## Edge Cases and Solutions

### Circular References

```javascript
// Handle circular references carefully
const data = {
    "@id": "node1",
    "name": "Node 1",
    "next": "#node2"
};

// Avoid infinite loops in templates
// Use constraints to limit depth
```

### Missing Data Handling

```html
<!-- Provide fallbacks -->
<div itemscope>
    <h1 itemprop="title">
        <span data-constraint="!title">Untitled</span>
    </h1>
    <p itemprop="description">
        <span data-constraint="!description">No description available</span>
    </p>
</div>
```

### Type Conflicts

```javascript
// Handle when data doesn't match any template
const result = template.render(unknownData);
if (result === null) {
    // Fallback handling
    console.warn('No matching template for data type');
}
```

## Best Practices

1. **Design data-first** - Structure your data to match your templates
2. **Use type information** - Always include @type for better matching
3. **Keep constraints simple** - Complex logic belongs in JavaScript
4. **Test with real data** - Ensure templates handle all scenarios
5. **Document relationships** - Make @id references clear
6. **Optimize for common cases** - Put frequently used templates first
7. **Handle errors gracefully** - Always check for null results
8. **Consider accessibility** - Semantic HTML improves screen reader support