# HTML-Template

A simple templating language for HTML, that is based on the template tag, and the itemprop/itemtype/itemscope attributes.

HTMLTemplate is a plain-vanilla javascript module, and can just be included in a javascript module on your website.

## Basic template structure

The most basic way of rendering a template is to load it out of the DOM, and then specify the selector _inside_ the template
tag that you're looking to render, with some data:

    ```html
    <template>
        <span itemprop="foo"></span>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template'), 'span' );
        const element = tmpl.render( { foo: "bar" } );
        element.outerHTML
        // <span itemprop="foo">bar</span>
    </script>
    ```
## Array-like things

Templates also work with properties that happen to be lists.

    ```html
    <template>
        <ul><li itemprop="foo[]"></li></ul>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template'), 'div' );
        const element = tmpl.render( { foo: ["bar","baz","boo"] } );
        element.outerHTML
        // <ul><li itemprop="foo">bar</li><li itemprop="foo">baz</li><li itemprop="foo">boo</li></ul>
    </script>
    ```

## Nested Objects

    ```html
    <template>
        <div itemprop="foo" itemscope>
            <span itemprop="bar"></span>
        </div>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template'), 'div' );
        const element = tmpl.render( { foo: { bar: "baz" } } );
        element.outerHTML
        // <div itemprop="foo" itemscope>
        //    <span itemprop="bar">baz</span>
        // </div>
    </script>
    ```

## Attributes

Attributes can also be templated. For example, here the href attribute of the a tag is templated,
as is the name.

    ```html
    <template>
        <a href="${url}" itemprop="name"></a>        
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template'), 'div' );
        const element = tmpl.render( { url: "http://www.example.com" name: "Example URL" } );
        element.outerHTML
        // <a href="https://example.com">Example URL</a>
    </script>
    ```

## _Special_ elements

There are a number of _special_ elements, where the templated value of the element is set through
means other than just setting the innerHTML content.

Some examples, amongst others: 

    * an `input` element in a template will have its `value` attribute set. 
    * A select will have the appropriate option set its `checked` attribute.
    * A `meta` element will have its `content` attribute set.

HTMLTemplate tries very hard to Do The Right Thing with data.

# Microdata Types

HTMLTemplate is aware of microdata types, and looks for ways to render them. Microdata
types allow the second paramter to the HTMLTemplate constructor to be omitted.

    ```html
    <template>
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
        </div>
        <li itemscope itemtype="https://schema.org/Action" itemprop="name"></li>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render({
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "name"     : "John Doe"
        });
        element.outerHTML
        // <div itemscope itemtype="https://schema.org/Person">
        //   <h1>John Doe</h1>
        // </div>

        const e2 = templ.render({
            "@type": "Action",
            "@context": "https://schema.org",
            "name": "Take the bins out"
        });
        element.outerHTML
        // <li itemscope itemtype="https://schema.org/Action" itemprop="name">Take the bins out</li>

    </script>
    ```

    HTMLTemplate can also render lists of things. It's important to note that an array in will always result in 
    an array as the return value.

    ```html
    <template>
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
        </div>        
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render([ {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "name"     : "John Doe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "name"     : "Jane Doe"
        }]);
        element.map( e => e.outerHTML )
        // ['<div itemscope itemtype="https://schema.org/Person">
        //   <h1>John Doe</h1>
        // </div>',
        // '<div itemscope itemtype="https://schema.org/Person">
        //   <h1>Jane Doe</h1>
        // </div>']
    </script>
    ```

Microdata is a powerful tool, and is all about making data linking work in a 
decoupled way. Template rendering can be constrained through the use of scopes, which
know about microdata ids.

    ```html
    <template>
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
            <h2>Jobs</h2>
            <ul>
                <li itemscope itemtype="https://schema.org/Action" data-scope="agent">
                    <span itemprop="name"></span>
                </li>
            </ul>
        </div>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render([{
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Take the bins out"
            "agent"    : "#johndoe"
        }, {
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Pick up milk"
            "agent"    : "#johndoe"
        }, {
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Reboot the server"
            "agent"    : "#janedoe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "@id"      : "janedoe",
            "name"     : "Jane Doe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "@id"      : "johndoe",
            "name"     : "John Doe"
        }]);
        element.outerHTML
        //<div itemscope itemtype="https://schema.org/Person">
        //    <h1 itemprop="name">John Doe</h1>
        //    <h2>Jobs</h2>
        //    <ul>
        //        <li itemscope itemtype="https://schema.org/Action" data-scope="agent">
        //            <span itemprop="name">Pick up milk</span>
        //        </li>
        //        <li itemscope itemtype="https://schema.org/Action" data-scope="agent">
        //            <span itemprop="name">Take the bins out</span>
        //        </li>
        //    </ul>
        //</div>
        //<div itemscope itemtype="https://schema.org/Person">
        //    <h1 itemprop="name">Jane Doe</h1>
        //    <h2>Jobs</h2>
        //    <ul>
        //        <li itemscope itemtype="https://schema.org/Action" data-scope="agent">
        //            <span itemprop="name">Reboot the server</span>
        //        </li>
        //    </ul>
        //</div>
    </script>
    ```

Constraints can be more complicated, the data-scope attribute is shorthand for a data-constraint:

    ```html
    <template>
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
            <h2>Jobs</h2>
            <ul>
                <li itemscope itemtype="https://schema.org/Action" data-constraint="agent==@id">
                    <span itemprop="name"></span>
                </li>
            </ul>
        </div>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render([{
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Take the bins out"
            "agent"    : "#johndoe"
        }, {
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Pick up milk"
            "agent"    : "#johndoe"
        }, {
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Reboot the server"
            "agent"    : "#janedoe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "@id"      : "janedoe",
            "name"     : "Jane Doe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "@id"      : "johndoe",
            "name"     : "John Doe"
        }]);
        element.outerHTML
        //<div itemscope itemtype="https://schema.org/Person">
        //    <h1 itemprop="name">John Doe</h1>
        //    <h2>Jobs</h2>
        //    <ul>
        //        <li itemscope itemtype="https://schema.org/Action" data-constraint="agent==@id">
        //            <span itemprop="name">Pick up milk</span>
        //        </li>
        //        <li itemscope itemtype="https://schema.org/Action" data-constraint="agent==@id">
        //            <span itemprop="name">Take the bins out</span>
        //        </li>
        //    </ul>
        //</div>
        //<div itemscope itemtype="https://schema.org/Person">
        //    <h1 itemprop="name">Jane Doe</h1>
        //    <h2>Jobs</h2>
        //    <ul>
        //        <li itemscope itemtype="https://schema.org/Action" data-constraint="agent==@id">
        //            <span itemprop="name">Reboot the server</span>
        //        </li>
        //    </ul>
        //</div>
    </script>
    ```

Similarly, we could invert the template:

    ```html
    <template>
        <ul>
            <li itemscope itemtype="https://schema.org/Action">
                <span itemprop="name"></span> owned by <span itemscope itemtype="https://schema.org/Person" itemprop="name" data-constraint="@id==agent"></span>
            </li>            
        </ul>
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render([{
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Take the bins out"
            "agent"    : "#johndoe"
        }, {
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Pick up milk"
            "agent"    : "#johndoe"
        }, {
            "@type"    : 'Action',
            "@context" : "https://schema.org",
            "name"     : "Reboot the server"
            "agent"    : "#janedoe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "@id"      : "janedoe",
            "name"     : "Jane Doe"
        }, {
            "@type"    : 'Person',
            "@context" : "https://schema.org",
            "@id"      : "johndoe",
            "name"     : "John Doe"
        }]);
        element.outerHTML
        //<ul>
        //    <li itemscope itemtype="https://schema.org/Action">
        //        <span itemprop="name">Take the bins out</span> owned by <span itemscope itemtype="https://schema.org/Person" itemprop="name" data-constraint="@id==agent">John Doe</span>
        //    </li>            
        //    <li itemscope itemtype="https://schema.org/Action">
        //        <span itemprop="name">Pick up milk</span> owned by <span itemscope itemtype="https://schema.org/Person" itemprop="name" data-constraint="@id==agent">John Doe</span>
        //    </li>            
        //    <li itemscope itemtype="https://schema.org/Action">
        //        <span itemprop="name">Reboot the server</span> owned by <span itemscope itemtype="https://schema.org/Person" itemprop="name" data-constraint="@id==agent">Jane Doe</span>
        //    </li>            
        //</ul>
    </script>
    ```

## Other Input Data

Templates can also be rendered with other data sources, first and foremost, 
other microdata elements.

    ```html
    <ul>
        <li itemscope itemtype="https://schema.org/Person">
            <span itemprop="name">John Doe</span>
        </li>
        <li itemscope itemtype="https://schema.org/Person">
            <span itemprop="name">Jane Doe</span>
        </li>
    </ul>
    <template>        
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
        </div>        
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render( document.querySelector('ul') );
        element.map( e => e.outerHTML )
        // ['<div itemscope itemtype="https://schema.org/Person">
        //   <h1>John Doe</h1>
        // </div>',
        // '<div itemscope itemtype="https://schema.org/Person">
        //   <h1>Jane Doe</h1>
        // </div>']
    </script>
    ```

If the microdata elements have an id attribute, then the rendered elements will get
the itemid attribute, and reference the source:

   ```html
    <base href="https://example.com/people">
    <ul>
        <li id="johndoe" itemscope itemtype="https://schema.org/Person">
            <span itemprop="name">John Doe</span>
        </li>
        <li id="janedoe" itemscope itemtype="https://schema.org/Person">
            <span itemprop="name">Jane Doe</span>
        </li>
    </ul>
    <template>        
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
        </div>        
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        const element = tmpl.render( document.querySelector('ul') );
        element.map( e => e.outerHTML )
        // ['<div itemscope itemtype="https://schema.org/Person" itemid="https://example.com/people#johndoe>
        //   <h1>John Doe</h1>
        // </div>',
        // '<div itemscope itemtype="https://schema.org/Person" itemid="https://example.com/people#janedoe>
        //   <h1>Jane Doe</h1>
        // </div>']
    </script>
    ```

Templates can also be rendered from a form. To specify nested properties in the form, use
dot notation in the form element's name.

   ```html
    <form>
        <label>Name</label><input type="text" name="name" placeholder="Enter your name">
        <button>Submit</button>
    </form>
    <template>        
        <div itemscope itemtype="https://schema.org/Person">
            <h1 itemprop="name"></h1>
        </div>        
    </template>
    <script>
        import { HTMLTemplate } from "./index.mjs";
        const tmpl = new HTMLTemplate( document.querySelector('template') );
        document.forms[0].addEventListener('submit', (e) => {
            e.preventDefault();
            const element = tmpl.render( document.forms[0] );
            element.map( e => e.outerHTML )
            // '<div itemscope itemtype="https://schema.org/Person">
            //   <h1>John Doe</h1>
            // </div>',
        })
    </script>
    ```