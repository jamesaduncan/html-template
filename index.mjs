class HTMLTemplate {
    constructor(templateElement, selector) {
        if (!templateElement || !(templateElement instanceof HTMLTemplateElement)) {
            throw new Error('First parameter must be an HTMLTemplateElement');
        }
        
        this.templateElement = templateElement;
        this.selector = selector;
        
        // Cache for parsed template data
        this._templateCache = null;
        this._parseTemplate();
    }
    
    render(data) {
        // Handle different data source types
        const extractedData = this._extractDataFromSource(data);
        
        // Store for reference resolution
        this._lastRenderData = extractedData;
        
        // Always return array for array input
        if (Array.isArray(extractedData)) {
            // If we have templates with itemtype, filter to only matching types
            const hasTypedTemplates = this._templateCache.rootElements.some(t => t.itemtype);
            if (hasTypedTemplates && !this.selector) {
                // Only render items that have a matching template
                const results = [];
                for (const item of extractedData) {
                    const result = this._renderSingle(item);
                    if (result !== null) {
                        results.push(result);
                    }
                }
                return results;
            } else {
                // Render all items
                return extractedData.map(item => this._renderSingle(item));
            }
        }
        
        return this._renderSingle(extractedData);
    }
    
    _parseTemplate() {
        // Clone template content for parsing
        const content = this.templateElement.content.cloneNode(true);
        
        // Find root element(s) to render
        let rootElements;
        if (this.selector) {
            rootElements = content.querySelectorAll(this.selector);
        } else {
            // Look for DIRECT CHILDREN with itemtype for type-based matching
            rootElements = Array.from(content.children).filter(el => el.hasAttribute('itemtype'));
            if (rootElements.length === 0) {
                // Fall back to all direct children
                rootElements = Array.from(content.children);
            }
        }
        
        this._templateCache = {
            rootElements: Array.from(rootElements).map(el => ({
                element: el,
                itemtype: el.getAttribute('itemtype'),
                structure: this._analyzeElement(el)
            }))
        };
    }
    
    _analyzeElement(element) {
        const analysis = {
            itemprop: element.getAttribute('itemprop'),
            itemscope: element.hasAttribute('itemscope'),
            itemtype: element.getAttribute('itemtype'),
            dataScope: element.getAttribute('data-scope'),
            dataConstraint: element.getAttribute('data-constraint'),
            scope: element.getAttribute('scope'),
            isArray: false,
            attributes: {},
            children: []
        };
        
        // Check if this is an array property
        if (analysis.itemprop && analysis.itemprop.endsWith('[]')) {
            analysis.isArray = true;
            analysis.cleanItemprop = analysis.itemprop.slice(0, -2);
        } else {
            analysis.cleanItemprop = analysis.itemprop;
        }
        
        // Analyze attributes for templating
        for (const attr of element.attributes) {
            if (attr.value.includes('${')) {
                analysis.attributes[attr.name] = attr.value;
            }
        }
        
        // Recursively analyze children
        for (const child of element.children) {
            analysis.children.push(this._analyzeElement(child));
        }
        
        return analysis;
    }
    
    _extractDataFromSource(source) {
        // Handle null/undefined
        if (source == null) {
            return {};
        }
        
        // Handle arrays
        if (Array.isArray(source)) {
            return source.map(item => this._extractDataFromSource(item));
        }
        
        // Handle forms first (before general Element check)
        if (source instanceof HTMLFormElement) {
            return this._extractFromForm(source);
        }
        
        // Handle DOM elements with microdata
        if (source instanceof Element) {
            if (source.tagName === 'UL' || source.tagName === 'OL') {
                // Extract from list items
                const items = [];
                for (const li of source.children) {
                    if (li.hasAttribute('itemscope')) {
                        items.push(this._extractFromMicrodata(li));
                    }
                }
                return items;
            }
            return this._extractFromMicrodata(source);
        }
        
        // Handle FormData
        if (source instanceof FormData) {
            return this._extractFromFormData(source);
        }
        
        // Assume it's already a data object
        return source;
    }
    
    _extractFromMicrodata(element) {
        const data = {};
        
        // Add @type if itemtype is present
        const itemtype = element.getAttribute('itemtype');
        if (itemtype) {
            data['@type'] = itemtype.split('/').pop();
            data['@context'] = itemtype.substring(0, itemtype.lastIndexOf('/'));
        }
        
        // Add @id if id is present
        if (element.id) {
            data['@id'] = element.id;
        }
        
        // Process itemscope
        if (element.hasAttribute('itemscope')) {
            // Find all itemprop elements within this scope
            const itemprops = element.querySelectorAll('[itemprop]');
            
            for (const propElement of itemprops) {
                // Skip if it's in a nested itemscope
                let parent = propElement.parentElement;
                let isNested = false;
                while (parent && parent !== element) {
                    if (parent.hasAttribute('itemscope')) {
                        isNested = true;
                        break;
                    }
                    parent = parent.parentElement;
                }
                
                if (!isNested) {
                    const propName = propElement.getAttribute('itemprop');
                    const value = propElement.hasAttribute('itemscope') 
                        ? this._extractFromMicrodata(propElement)
                        : propElement.textContent.trim();
                    
                    // Handle multiple values for same property
                    if (data[propName] !== undefined) {
                        if (!Array.isArray(data[propName])) {
                            data[propName] = [data[propName]];
                        }
                        data[propName].push(value);
                    } else {
                        data[propName] = value;
                    }
                }
            }
        } else if (element.hasAttribute('itemprop')) {
            // Just a single property
            return element.textContent.trim();
        }
        
        return data;
    }
    
    _extractFromForm(form) {
        const formData = new FormData(form);
        const data = this._extractFromFormData(formData);
        // Don't add form ID as @id - it's not meaningful for the data
        return data;
    }
    
    _extractFromFormData(formData) {
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            this._setNestedProperty(data, key, value);
        }
        
        return data;
    }
    
    _setNestedProperty(obj, path, value) {
        // Handle array notation like items[]
        if (path.includes('[]')) {
            const arrayPath = path.replace('[]', '');
            const parts = arrayPath.split('.').filter(Boolean);
            let current = obj;
            
            // Navigate to the parent of the array
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!(part in current)) {
                    current[part] = {};
                }
                current = current[part];
            }
            
            // Create or append to array
            const arrayKey = parts[parts.length - 1] || parts[0];
            if (!Array.isArray(current[arrayKey])) {
                current[arrayKey] = [];
            }
            current[arrayKey].push(value);
        } else {
            // Handle regular dot notation
            const parts = path.split(/[\.\[\]]+/).filter(Boolean);
            let current = obj;
            
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                const nextPart = parts[i + 1];
                
                // Check if next part is numeric (array index)
                const isNextArray = /^\d+$/.test(nextPart);
                
                if (!(part in current)) {
                    current[part] = isNextArray ? [] : {};
                }
                
                current = current[part];
            }
            
            const lastPart = parts[parts.length - 1];
            current[lastPart] = value;
        }
    }
    
    _renderSingle(data) {
        // Find matching template
        let matchingTemplate = null;
        
        if (data['@type'] && !this.selector) {
            // Type-based matching
            const schemaType = data['@context'] + '/' + data['@type'];
            matchingTemplate = this._templateCache.rootElements.find(
                t => t.itemtype === schemaType
            );
            
            // If no matching template found and we have typed templates, skip this item
            if (!matchingTemplate && this._templateCache.rootElements.some(t => t.itemtype)) {
                return null;
            }
        }
        
        if (!matchingTemplate) {
            // Only use first available template if it's not typed or data is not typed
            const firstTemplate = this._templateCache.rootElements[0];
            if (firstTemplate && (!firstTemplate.itemtype || !data['@type'])) {
                matchingTemplate = firstTemplate;
            }
        }
        
        if (!matchingTemplate) {
            console.warn('No matching template found for data:', data);
            return null;
        }
        
        // Clone the template element
        const element = matchingTemplate.element.cloneNode(true);
        
        // Create rendering context
        const context = {
            rootData: data,
            currentData: data,
            allData: Array.isArray(this._lastRenderData) ? this._lastRenderData : [data]
        };
        
        // Process the element
        this._processElement(element, matchingTemplate.structure, data, context);
        
        return element;
    }
    
    _processElement(element, structure, data, context) {
        // Safety check for structure
        if (!structure) {
            return;
        }
        
        // Check constraints
        if (structure.dataScope || structure.dataConstraint) {
            // Special handling for data-scope - this acts like an array filter
            if (structure.dataScope) {
                const matches = this._findScopeMatches(structure.dataScope, data, context);
                if (matches.length > 0) {
                    // Process as array-like
                    this._processScopeArray(element, structure, matches, context);
                    return;
                } else {
                    element.remove();
                    return;
                }
            }
            
            if (!this._evaluateConstraint(element, structure, data, context)) {
                element.remove();
                return;
            }
            // If constraint resolved a reference, use it
            if (context._resolvedReference) {
                data = context._resolvedReference;
                delete context._resolvedReference;
            }
        }
        
        // Handle scope attribute for references
        if (structure.scope) {
            const referencedData = this._resolveReference(structure.scope, data, context);
            if (referencedData) {
                data = referencedData;
            }
        }
        
        // Process arrays
        if (structure.isArray && structure.cleanItemprop && data[structure.cleanItemprop]) {
            this._processArray(element, structure, data[structure.cleanItemprop], context);
            return;
        }
        
        // Process attributes with templating
        for (const [attrName, attrValue] of Object.entries(structure.attributes)) {
            const newValue = this._replaceAttributeVariables(attrValue, data);
            element.setAttribute(attrName, newValue);
        }
        
        // Process itemprop
        if (structure.cleanItemprop) {
            const value = data[structure.cleanItemprop];
            
            if (value !== undefined) {
                // Handle nested objects
                if (structure.itemscope && typeof value === 'object' && !Array.isArray(value)) {
                    // Process children with nested data
                    const nestedContext = { ...context, currentData: value };
                    for (let i = 0; i < element.children.length; i++) {
                        this._processElement(
                            element.children[i],
                            structure.children[i],
                            value,
                            nestedContext
                        );
                    }
                } else {
                    // Set the value
                    this._setElementValue(element, value);
                }
            }
            
            // Clean up array notation
            if (structure.isArray) {
                element.setAttribute('itemprop', structure.cleanItemprop);
            }
        } else {
            // No itemprop - process children with current data
            // This handles root elements with itemscope
            for (let i = 0; i < element.children.length; i++) {
                if (structure.children && structure.children[i]) {
                    this._processElement(
                        element.children[i],
                        structure.children[i],
                        data,
                        context
                    );
                }
            }
        }
        
        // Add itemid if data has @id
        if (data && data['@id'] && element.hasAttribute('itemscope')) {
            const baseURI = document.baseURI;
            element.setAttribute('itemid', baseURI + '#' + data['@id']);
        }
    }
    
    _processArray(element, structure, arrayData, context) {
        if (!Array.isArray(arrayData)) {
            console.warn('Expected array for property:', structure.cleanItemprop);
            return;
        }
        
        const parent = element.parentNode;
        const nextSibling = element.nextSibling;
        
        // Remove original element
        element.remove();
        
        // Create elements for each array item
        for (const item of arrayData) {
            const newElement = element.cloneNode(true);
            
            // Clean up array notation
            if (structure.isArray) {
                newElement.setAttribute('itemprop', structure.cleanItemprop);
            }
            
            // Process the cloned element
            if (typeof item === 'object' && structure.children.length > 0) {
                const itemContext = { ...context, currentData: item };
                for (let i = 0; i < newElement.children.length; i++) {
                    this._processElement(
                        newElement.children[i],
                        structure.children[i],
                        item,
                        itemContext
                    );
                }
            } else {
                this._setElementValue(newElement, item);
            }
            
            // Insert before next sibling or append
            if (nextSibling) {
                parent.insertBefore(newElement, nextSibling);
            } else {
                parent.appendChild(newElement);
            }
        }
    }
    
    _setElementValue(element, value) {
        const tagName = element.tagName.toLowerCase();
        
        // Special element handling
        switch (tagName) {
            case 'input':
                const type = element.type;
                if (type === 'checkbox' || type === 'radio') {
                    element.checked = Boolean(value);
                    // Also set the checked attribute for visibility in HTML
                    if (Boolean(value)) {
                        element.setAttribute('checked', 'checked');
                    } else {
                        element.removeAttribute('checked');
                    }
                } else {
                    element.value = value;
                    // Set value attribute for visibility
                    element.setAttribute('value', value);
                }
                break;
                
            case 'textarea':
                element.textContent = value;
                element.value = value;
                break;
                
            case 'select':
                // Find and select the matching option
                for (const option of element.options) {
                    if (option.value === value) {
                        option.selected = true;
                        option.setAttribute('selected', 'selected');
                    } else {
                        option.selected = false;
                        option.removeAttribute('selected');
                    }
                }
                break;
                
            case 'option':
                element.selected = Boolean(value);
                break;
                
            case 'output':
                element.value = value;
                break;
                
            case 'meta':
                element.setAttribute('content', value);
                break;
                
            case 'img':
                element.setAttribute('src', value);
                break;
                
            case 'link':
                element.setAttribute('href', value);
                break;
                
            case 'audio':
            case 'video':
            case 'source':
                element.setAttribute('src', value);
                break;
                
            case 'object':
                element.setAttribute('data', value);
                break;
                
            case 'embed':
            case 'iframe':
                element.setAttribute('src', value);
                break;
                
            case 'time':
                element.setAttribute('datetime', value);
                break;
                
            case 'data':
            case 'meter':
            case 'progress':
                element.setAttribute('value', value);
                break;
                
            default:
                // Default: set text content
                element.textContent = value;
        }
    }
    
    _replaceAttributeVariables(template, data) {
        return template.replace(/\$\{(\w+)\}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    }
    
    _evaluateConstraint(element, structure, data, context) {
        // Handle data-scope (shorthand for property matching)
        if (structure.dataScope) {
            const scopeValue = data[structure.dataScope];
            const contextId = context.rootData['@id'];
            
            if (contextId && scopeValue) {
                return scopeValue === '#' + contextId || scopeValue === contextId;
            }
            return false;
        }
        
        // Handle data-constraint (complex expressions)
        if (structure.dataConstraint) {
            return this._evaluateExpression(structure.dataConstraint, data, context);
        }
        
        return true;
    }
    
    _evaluateExpression(expression, data, context) {
        // Handle special case: @id==agent
        if (expression === '@id==agent') {
            // We need to find the item whose @id matches the agent reference
            const agentRef = context.currentData.agent || data.agent;
            if (agentRef && agentRef.startsWith('#')) {
                const id = agentRef.substring(1);
                // Find matching item in allData
                const match = context.allData.find(item => item['@id'] === id);
                if (match) {
                    // We found a match, we'll use this data for rendering
                    // Store reference for later use
                    context._resolvedReference = match;
                    return true;
                }
            }
            return false;
        }
        
        // Simple expression evaluator
        // Supports: ==, !=, <, >, <=, >=, &&, ||, !
        
        // Replace @id with actual value
        expression = expression.replace('@id', `"${data['@id'] || ''}"`);
        
        // Replace property names with values
        const props = expression.match(/\b\w+\b/g) || [];
        for (const prop of props) {
            if (data.hasOwnProperty(prop)) {
                const value = data[prop];
                if (typeof value === 'string') {
                    expression = expression.replace(
                        new RegExp('\\b' + prop + '\\b', 'g'),
                        `"${value}"`
                    );
                } else {
                    expression = expression.replace(
                        new RegExp('\\b' + prop + '\\b', 'g'),
                        JSON.stringify(value)
                    );
                }
            }
        }
        
        try {
            // Evaluate the expression
            return Function('"use strict"; return (' + expression + ')')();
        } catch (e) {
            console.warn('Failed to evaluate constraint:', expression, e);
            return false;
        }
    }
    
    _findScopeMatches(scope, data, context) {
        // Find all items in allData where the scope property matches the current @id
        const currentId = context.rootData['@id'];
        if (!currentId) return [];
        
        return context.allData.filter(item => {
            const scopeValue = item[scope];
            return scopeValue === '#' + currentId || scopeValue === currentId;
        });
    }
    
    _processScopeArray(element, structure, matches, context) {
        const parent = element.parentNode;
        const nextSibling = element.nextSibling;
        
        // Remove original element
        element.remove();
        
        // Create elements for each match
        for (const match of matches) {
            const newElement = element.cloneNode(true);
            
            // Process the cloned element with the matched data
            const matchContext = { ...context, currentData: match };
            for (let i = 0; i < newElement.children.length; i++) {
                if (structure.children && structure.children[i]) {
                    this._processElement(
                        newElement.children[i],
                        structure.children[i],
                        match,
                        matchContext
                    );
                }
            }
            
            // Also handle the element's own itemprop if it has one
            if (structure.cleanItemprop && match[structure.cleanItemprop] !== undefined) {
                this._setElementValue(newElement, match[structure.cleanItemprop]);
            }
            
            // Insert before next sibling or append
            if (nextSibling) {
                parent.insertBefore(newElement, nextSibling);
            } else {
                parent.appendChild(newElement);
            }
        }
    }
    
    _resolveReference(reference, data, context) {
        // For data-constraint="@id==agent", we need to find matching data
        // This is used to look up referenced objects
        return null; // Let constraint handle the logic
    }
}

export { HTMLTemplate };
