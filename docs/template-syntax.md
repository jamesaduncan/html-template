# Template Syntax Guide

This guide covers the complete template syntax for HTMLTemplate.

## Basic Structure

Templates are defined using HTML `<template>` elements with microdata attributes:

```html
<template id="my-template">
    <div itemscope>
        <span itemprop="propertyName"></span>
    </div>
</template>
```

## Microdata Attributes

### itemprop

Marks an element as a data binding point.

```html
<!-- Simple property -->
<span itemprop="name"></span>

<!-- Multiple properties on same element -->
<span itemprop="firstName lastName"></span>
```

### itemscope

Defines a new object scope for nested properties.

```html
<div itemscope>
    <h1 itemprop="title"></h1>
    <div itemprop="author" itemscope>
        <span itemprop="name"></span>
        <span itemprop="email"></span>
    </div>
</div>
```

Data structure:
```javascript
{
    title: "My Article",
    author: {
        name: "Jane Doe",
        email: "jane@example.com"
    }
}
```

### itemtype

Specifies the Schema.org type for type-based template matching.

```html
<article itemscope itemtype="https://schema.org/BlogPosting">
    <h1 itemprop="headline"></h1>
    <time itemprop="datePublished"></time>
</article>
```

## Array Syntax

### Basic Arrays

Use `[]` suffix for array properties:

```html
<ul>
    <li itemprop="tags[]"></li>
</ul>
```

The `[]` is removed in the rendered output:

```html
<!-- Rendered -->
<ul>
    <li itemprop="tags">JavaScript</li>
    <li itemprop="tags">HTML</li>
    <li itemprop="tags">CSS</li>
</ul>
```

### Arrays of Objects

```html
<div class="people">
    <div itemprop="members[]" itemscope>
        <h3 itemprop="name"></h3>
        <p itemprop="role"></p>
    </div>
</div>
```

### Nested Arrays

```html
<div itemprop="categories[]" itemscope>
    <h2 itemprop="name"></h2>
    <ul>
        <li itemprop="items[]"></li>
    </ul>
</div>
```

## Attribute Templating

Use `${propertyName}` syntax in any attribute:

```html
<!-- href attribute -->
<a href="${url}" itemprop="name"></a>

<!-- Multiple variables -->
<img src="${imagePath}" alt="${altText}" title="${tooltip}">

<!-- Class names -->
<div class="card ${cardType}">

<!-- Data attributes -->
<div data-id="${id}" data-category="${category}">
```

### Limitations

- Only simple property names (no nested properties)
- No expressions or concatenation
- No filters or transformations

## Special Element Templates

### Form Inputs

```html
<!-- Text input -->
<input type="text" itemprop="username">

<!-- Checkbox -->
<input type="checkbox" itemprop="isActive">

<!-- Radio buttons -->
<input type="radio" name="plan" value="basic" itemprop="selectedPlan">
<input type="radio" name="plan" value="pro" itemprop="selectedPlan">

<!-- Textarea -->
<textarea itemprop="description"></textarea>

<!-- Select -->
<select itemprop="country">
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
</select>
```

### Media Elements

```html
<!-- Images -->
<img itemprop="profilePicture">
<img itemprop="thumbnail" width="${width}" height="${height}">

<!-- Audio -->
<audio itemprop="podcast" controls></audio>

<!-- Video -->
<video itemprop="presentation" poster="${posterUrl}"></video>

<!-- Picture with sources -->
<picture>
    <source srcset="${webpUrl}" type="image/webp">
    <img itemprop="image">
</picture>
```

### Metadata Elements

```html
<!-- Meta tags -->
<meta itemprop="description">
<meta itemprop="keywords">

<!-- Link elements -->
<link itemprop="canonical">
<link itemprop="stylesheet" rel="stylesheet">

<!-- Time elements -->
<time itemprop="published"></time>
<time itemprop="modified" pubdate></time>
```

### Other Special Elements

```html
<!-- Progress -->
<progress itemprop="completion" max="100"></progress>

<!-- Meter -->
<meter itemprop="rating" min="0" max="5"></meter>

<!-- Output -->
<output itemprop="result"></output>

<!-- Data -->
<data itemprop="productId"></data>

<!-- Object -->
<object itemprop="document" type="application/pdf"></object>

<!-- Embed -->
<embed itemprop="widget" type="application/x-shockwave-flash">

<!-- Iframe -->
<iframe itemprop="preview"></iframe>
```

## Type-Based Templates

### Single Type Template

```html
<template>
    <article itemscope itemtype="https://schema.org/NewsArticle">
        <h1 itemprop="headline"></h1>
        <div itemprop="author" itemscope itemtype="https://schema.org/Person">
            <span itemprop="name"></span>
        </div>
    </article>
</template>
```

### Multiple Type Templates

```html
<template>
    <!-- Person template -->
    <div itemscope itemtype="https://schema.org/Person" class="person-card">
        <h2 itemprop="name"></h2>
        <p itemprop="jobTitle"></p>
    </div>
    
    <!-- Organization template -->
    <div itemscope itemtype="https://schema.org/Organization" class="org-card">
        <h2 itemprop="name"></h2>
        <p itemprop="description"></p>
    </div>
</template>
```

The correct template is chosen based on the `@type` in your data.

## Constraint Attributes

### data-scope

Filters array items based on a property matching the parent's @id:

```html
<div itemscope itemtype="https://schema.org/Person">
    <h1 itemprop="name"></h1>
    <ul>
        <li itemprop="tasks[]" itemscope data-scope="assignee">
            <span itemprop="title"></span>
        </li>
    </ul>
</div>
```

### data-constraint

Complex constraint expressions:

```html
<!-- Equality -->
<div data-constraint="status==active">

<!-- Comparison -->
<div data-constraint="priority>5">

<!-- Multiple conditions -->
<div data-constraint="status==active && priority>5">

<!-- Reference matching -->
<span data-constraint="@id==author">
```

## Complete Example

Here's a comprehensive template showcasing various features:

```html
<template id="blog-post">
    <article itemscope itemtype="https://schema.org/BlogPosting" 
             class="${postType}" 
             data-id="${id}">
        
        <!-- Header -->
        <header>
            <h1 itemprop="headline"></h1>
            <time itemprop="datePublished" 
                  datetime="${publishDate}"></time>
        </header>
        
        <!-- Author -->
        <div itemprop="author" itemscope 
             itemtype="https://schema.org/Person">
            <img itemprop="image" 
                 alt="${name}'s profile picture">
            <span itemprop="name"></span>
            <a href="mailto:${email}" itemprop="email"></a>
        </div>
        
        <!-- Content -->
        <div itemprop="articleBody"></div>
        
        <!-- Tags -->
        <ul class="tags">
            <li itemprop="keywords[]" class="tag"></li>
        </ul>
        
        <!-- Comments -->
        <section class="comments">
            <h2>Comments</h2>
            <article itemprop="comment[]" itemscope 
                     itemtype="https://schema.org/Comment">
                <header>
                    <strong itemprop="author"></strong>
                    <time itemprop="dateCreated"></time>
                </header>
                <div itemprop="text"></div>
            </article>
        </section>
        
        <!-- Related posts (with constraints) -->
        <aside>
            <h3>Related Posts</h3>
            <ul>
                <li data-scope="relatedTo">
                    <a href="${url}" itemprop="headline"></a>
                </li>
            </ul>
        </aside>
    </article>
</template>
```

## Best Practices

1. **Use semantic HTML** - Choose appropriate elements for your content
2. **Add Schema.org types** - Improve SEO and enable type matching
3. **Keep templates focused** - One template per component/type
4. **Use meaningful property names** - Match your data structure
5. **Validate your microdata** - Use online validators to check syntax
6. **Test with real data** - Ensure templates handle edge cases
7. **Document complex templates** - Add comments for constraint logic