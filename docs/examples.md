# Real-World Examples

This guide provides practical examples of HTMLTemplate in real-world scenarios.

## E-Commerce Product Catalog

### Product Card Template

```html
<template id="product-catalog">
    <!-- Product card -->
    <article itemscope itemtype="https://schema.org/Product" 
             class="product-card ${category}">
        <img itemprop="image" alt="${name}">
        
        <div class="product-info">
            <h3 itemprop="name"></h3>
            <p itemprop="description"></p>
            
            <div itemprop="offers" itemscope 
                 itemtype="https://schema.org/Offer">
                <span class="price" itemprop="price"></span>
                <span class="currency" itemprop="priceCurrency"></span>
                
                <div class="availability" 
                     data-constraint="availability==InStock">
                    ✓ In Stock
                </div>
                <div class="availability" 
                     data-constraint="availability==OutOfStock">
                    ✗ Out of Stock
                </div>
            </div>
            
            <div class="rating" itemprop="aggregateRating" itemscope>
                <span itemprop="ratingValue"></span>/5
                (<span itemprop="reviewCount"></span> reviews)
            </div>
        </div>
        
        <button class="add-to-cart" 
                data-product-id="${@id}"
                data-constraint="availability==InStock">
            Add to Cart
        </button>
    </article>
</template>

<script type="module">
import { HTMLTemplate } from './index.mjs';

const template = new HTMLTemplate(document.getElementById('product-catalog'));

const products = [
    {
        "@type": "Product",
        "@context": "https://schema.org",
        "@id": "laptop-x1",
        "name": "UltraBook X1",
        "description": "Thin and powerful laptop for professionals",
        "image": "/images/laptop-x1.jpg",
        "category": "electronics",
        "offers": {
            "@type": "Offer",
            "price": "1299.99",
            "priceCurrency": "USD",
            "availability": "InStock"
        },
        "aggregateRating": {
            "ratingValue": "4.5",
            "reviewCount": "127"
        }
    },
    {
        "@type": "Product",
        "@context": "https://schema.org",
        "@id": "mouse-pro",
        "name": "Wireless Mouse Pro",
        "description": "Ergonomic wireless mouse with precision tracking",
        "image": "/images/mouse-pro.jpg",
        "category": "accessories",
        "offers": {
            "@type": "Offer",
            "price": "79.99",
            "priceCurrency": "USD",
            "availability": "OutOfStock"
        },
        "aggregateRating": {
            "ratingValue": "4.8",
            "reviewCount": "89"
        }
    }
];

const container = document.getElementById('products');
const elements = template.render(products);
elements.forEach(el => container.appendChild(el));
</script>
```

## Blog with Comments

### Blog Post Template

```html
<template id="blog-template">
    <article itemscope itemtype="https://schema.org/BlogPosting">
        <!-- Header -->
        <header>
            <h1 itemprop="headline"></h1>
            <div class="meta">
                <time itemprop="datePublished" 
                      datetime="${datePublished}">
                </time>
                <span class="reading-time">
                    ${readingTime} min read
                </span>
            </div>
        </header>
        
        <!-- Author info -->
        <div class="author" itemprop="author" itemscope 
             itemtype="https://schema.org/Person">
            <img itemprop="image" 
                 alt="${name}'s avatar"
                 class="avatar">
            <div>
                <strong itemprop="name"></strong>
                <p itemprop="jobTitle"></p>
            </div>
        </div>
        
        <!-- Content -->
        <div class="content" itemprop="articleBody"></div>
        
        <!-- Tags -->
        <div class="tags">
            <span class="tag" itemprop="keywords[]"></span>
        </div>
        
        <!-- Comments section -->
        <section class="comments">
            <h2>Comments (<span>${commentCount}</span>)</h2>
            
            <div class="comment" itemprop="comment[]" itemscope 
                 itemtype="https://schema.org/Comment">
                <div class="comment-header">
                    <strong itemprop="author"></strong>
                    <time itemprop="dateCreated" 
                          datetime="${dateCreated}"></time>
                </div>
                <div class="comment-body" itemprop="text"></div>
                
                <!-- Nested replies -->
                <div class="replies">
                    <div itemprop="replies[]" itemscope 
                         class="comment reply">
                        <strong itemprop="author"></strong>
                        <span itemprop="text"></span>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<script type="module">
const blogPost = {
    "@type": "BlogPosting",
    "@context": "https://schema.org",
    "headline": "Building Better Web Components",
    "datePublished": "2024-01-15T10:00:00Z",
    "readingTime": 5,
    "author": {
        "@type": "Person",
        "name": "Sarah Chen",
        "jobTitle": "Senior Frontend Engineer",
        "image": "/avatars/sarah.jpg"
    },
    "articleBody": "<p>Web components are a powerful way to create reusable UI elements...</p>",
    "keywords": ["web components", "javascript", "html", "custom elements"],
    "commentCount": 3,
    "comment": [
        {
            "@type": "Comment",
            "author": "Alex Kumar",
            "dateCreated": "2024-01-15T14:30:00Z",
            "text": "Great article! Very helpful for understanding web components.",
            "replies": [
                {
                    "author": "Sarah Chen",
                    "text": "Thanks Alex! Glad you found it helpful."
                }
            ]
        },
        {
            "@type": "Comment",
            "author": "Maria Garcia",
            "dateCreated": "2024-01-15T16:45:00Z",
            "text": "Could you provide more examples of shadow DOM usage?",
            "replies": []
        }
    ]
};

const template = new HTMLTemplate(document.getElementById('blog-template'));
const article = template.render(blogPost);
document.getElementById('blog-container').appendChild(article);
</script>
```

## Task Management Dashboard

### Kanban Board Template

```html
<template id="kanban-board">
    <!-- Board container -->
    <div class="kanban-board">
        <!-- Columns for different statuses -->
        <div class="column" data-status="todo">
            <h3>To Do</h3>
            <div class="tasks" data-scope="assignee">
                <div class="task-card" 
                     data-constraint="status==todo"
                     itemscope itemtype="https://schema.org/Task">
                    <h4 itemprop="name"></h4>
                    <p itemprop="description"></p>
                    <div class="task-meta">
                        <span class="priority ${priority}" 
                              itemprop="priority"></span>
                        <span class="due-date" 
                              itemprop="dueDate"></span>
                    </div>
                    <div class="assignee" 
                         data-constraint="@id==assignee">
                        <img itemprop="image" alt="${name}">
                        <span itemprop="name"></span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="column" data-status="in-progress">
            <h3>In Progress</h3>
            <div class="tasks" data-scope="assignee">
                <div class="task-card" 
                     data-constraint="status==in-progress"
                     itemscope itemtype="https://schema.org/Task">
                    <!-- Same structure as todo -->
                </div>
            </div>
        </div>
        
        <div class="column" data-status="done">
            <h3>Done</h3>
            <div class="tasks" data-scope="assignee">
                <div class="task-card" 
                     data-constraint="status==done"
                     itemscope itemtype="https://schema.org/Task">
                    <!-- Same structure with completed styling -->
                </div>
            </div>
        </div>
    </div>
</template>

<script type="module">
const projectData = [
    // Team members
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "dev1",
        "name": "John Developer",
        "image": "/avatars/john.jpg"
    },
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "dev2",
        "name": "Jane Designer",
        "image": "/avatars/jane.jpg"
    },
    // Tasks
    {
        "@type": "Task",
        "@context": "https://schema.org",
        "name": "Implement user authentication",
        "description": "Add login/logout functionality",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2024-01-20",
        "assignee": "#dev1"
    },
    {
        "@type": "Task",
        "@context": "https://schema.org",
        "name": "Design new landing page",
        "description": "Create mockups for homepage redesign",
        "status": "todo",
        "priority": "medium",
        "dueDate": "2024-01-25",
        "assignee": "#dev2"
    },
    {
        "@type": "Task",
        "@context": "https://schema.org",
        "name": "Fix navigation bug",
        "description": "Menu items not displaying on mobile",
        "status": "done",
        "priority": "high",
        "dueDate": "2024-01-15",
        "assignee": "#dev1"
    }
];

const template = new HTMLTemplate(document.getElementById('kanban-board'));
const board = template.render(projectData);
document.getElementById('dashboard').appendChild(board);
</script>
```

## Social Media Feed

### Post Template with Interactions

```html
<template id="social-feed">
    <article itemscope itemtype="https://schema.org/SocialMediaPosting" 
             class="post">
        <!-- Author -->
        <header class="post-header">
            <div itemprop="author" itemscope 
                 itemtype="https://schema.org/Person">
                <img itemprop="image" class="avatar">
                <div>
                    <strong itemprop="name"></strong>
                    <time itemprop="datePublished" 
                          datetime="${datePublished}"></time>
                </div>
            </div>
        </header>
        
        <!-- Content -->
        <div class="post-content">
            <p itemprop="articleBody"></p>
            
            <!-- Media attachments -->
            <div class="media-grid" 
                 data-constraint="images.length>0">
                <img itemprop="images[]" 
                     class="post-image">
            </div>
        </div>
        
        <!-- Interactions -->
        <div class="post-actions">
            <button class="like-btn ${liked?'liked':''}" 
                    data-post-id="${@id}">
                ❤️ <span itemprop="interactionCount">${likes}</span>
            </button>
            <button class="comment-btn">
                💬 <span>${comments.length}</span>
            </button>
            <button class="share-btn">
                🔄 <span itemprop="sharedCount">${shares}</span>
            </button>
        </div>
        
        <!-- Comments -->
        <div class="comments-section">
            <div class="comment" itemprop="comments[]" itemscope>
                <img data-constraint="@id==author" 
                     itemprop="image" 
                     class="avatar-small">
                <div class="comment-content">
                    <strong data-constraint="@id==author" 
                            itemprop="name"></strong>
                    <p itemprop="text"></p>
                </div>
            </div>
        </div>
    </article>
</template>

<script type="module">
const feedData = [
    // Users
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "user123",
        "name": "Alice Johnson",
        "image": "/avatars/alice.jpg"
    },
    {
        "@type": "Person",
        "@context": "https://schema.org",
        "@id": "user456",
        "name": "Bob Smith",
        "image": "/avatars/bob.jpg"
    },
    // Posts
    {
        "@type": "SocialMediaPosting",
        "@context": "https://schema.org",
        "@id": "post1",
        "author": "#user123",
        "datePublished": "2024-01-15T12:00:00Z",
        "articleBody": "Just launched my new project! Check it out 🚀",
        "images": ["/posts/project1.jpg", "/posts/project2.jpg"],
        "likes": 42,
        "shares": 5,
        "liked": true,
        "comments": [
            {
                "author": "#user456",
                "text": "Congratulations! This looks amazing!"
            }
        ]
    }
];

const template = new HTMLTemplate(document.getElementById('social-feed'));
const posts = template.render(feedData);
// Renders all posts with proper user references
</script>
```

## Form Builder Example

### Dynamic Form Generation

```html
<template id="form-builder">
    <form itemscope>
        <h2 itemprop="title"></h2>
        <p itemprop="description"></p>
        
        <!-- Dynamic fields -->
        <div class="form-field" itemprop="fields[]" itemscope>
            <!-- Text input -->
            <div data-constraint="type==text">
                <label for="${id}" itemprop="label"></label>
                <input type="text" 
                       id="${id}"
                       name="${name}"
                       placeholder="${placeholder}"
                       required="${required}">
            </div>
            
            <!-- Select dropdown -->
            <div data-constraint="type==select">
                <label for="${id}" itemprop="label"></label>
                <select id="${id}" name="${name}" required="${required}">
                    <option value="">Choose...</option>
                    <option itemprop="options[]" 
                            value="${value}"></option>
                </select>
            </div>
            
            <!-- Checkbox group -->
            <div data-constraint="type==checkbox-group">
                <fieldset>
                    <legend itemprop="label"></legend>
                    <label itemprop="options[]">
                        <input type="checkbox" 
                               name="${name}[]" 
                               value="${value}">
                        <span itemprop="label"></span>
                    </label>
                </fieldset>
            </div>
            
            <!-- Textarea -->
            <div data-constraint="type==textarea">
                <label for="${id}" itemprop="label"></label>
                <textarea id="${id}" 
                          name="${name}"
                          rows="${rows}"
                          placeholder="${placeholder}"></textarea>
            </div>
        </div>
        
        <button type="submit">Submit</button>
    </form>
</template>

<script type="module">
const formConfig = {
    title: "User Registration",
    description: "Please fill out all required fields",
    fields: [
        {
            type: "text",
            id: "username",
            name: "username",
            label: "Username",
            placeholder: "Choose a username",
            required: true
        },
        {
            type: "select",
            id: "country",
            name: "country",
            label: "Country",
            required: true,
            options: [
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
                { value: "ca", label: "Canada" }
            ]
        },
        {
            type: "checkbox-group",
            name: "interests",
            label: "Interests",
            options: [
                { value: "tech", label: "Technology" },
                { value: "sports", label: "Sports" },
                { value: "music", label: "Music" }
            ]
        },
        {
            type: "textarea",
            id: "bio",
            name: "bio",
            label: "Bio",
            rows: 4,
            placeholder: "Tell us about yourself..."
        }
    ]
};

const template = new HTMLTemplate(document.getElementById('form-builder'));
const form = template.render(formConfig);
document.getElementById('form-container').appendChild(form);
</script>
```

## Best Practices from Examples

1. **Use semantic HTML** - Proper elements improve accessibility
2. **Leverage microdata** - Makes content machine-readable
3. **Plan data relationships** - Use @id references effectively
4. **Handle edge cases** - Empty arrays, missing data, etc.
5. **Keep templates focused** - One component per template
6. **Use constraints wisely** - For conditional rendering
7. **Test with real data** - Ensure robustness
8. **Consider performance** - Batch operations when possible