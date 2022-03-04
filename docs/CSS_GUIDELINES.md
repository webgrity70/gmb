## CSS Guidelines

This project uses SASS preprocessor and the [BEM](http://getbem.com/) methodology for the following reasons:

* It helps create clear, strict relationships between CSS and HTML
* It allows for less nesting and lower specificity
* It helps in building scalable stylesheets
* It plays well with React reusable, composable components

### BEM Example

```js
function ListingCard() {
  return (
    <article class="ListingCard ListingCard--featured">
      <h1 class="ListingCard__title">Adorable 2BR in the sunny Mission</h1>

      <div class="ListingCard__content">
        <p>Vestibulum id ligula porta felis euismod semper.</p>
      </div>
    </article>
  );
}
```

### Namespacing

|     **Type**     | **Prefix** |     **Examples**      |                                                                                **Description**                                                                                |
| :--------------: | :--------: | :-------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    Component     |            |   Card Checklist   |                                       Form the backbone of an application and contain all of the cosmetics for a standalone component.                                        |
|  Layout module   |     l-     |  l-grid l-container   |                             Optional. These modules have no cosmetics and are purely used to position c- components and structure an application’s layout.                              |
|      States      |  is- has-  | is-visible has-loaded |                         Indicate different states that a c- component can have. More detail on this concept can be found inside problem 6 below, but                          |


### Nested selectors

Do not nest selectors more than three levels deep!

```css
.page-container {
  .content {
    .profile {
      // STOP!
    }
  }
}
```

### State hooks

To keep things consistent and to reduce the cognitive load of having to come up with names for state hooks we should try to stick with a set list of common state hook names, something like:

* is-active
* has-loaded
* is-loading
* is-visible
* is-disabled
* is-expanded
* is-collapsed

### Tips & Tricks

- Components should style only their shallow children, avoiding to style a child element in a child component, as this is prompt to issues if the internal structure of a component is changed. Also, components shouldn't have margin styles on their root element, as these should be applied by the parent component that uses them, same logic applies to having a grid column as the root element of a component, it should just be a div and leave up to the parent use a grid column.
- All component styles need to scoped, given we don't use CSS modules, our only scoping solution is having unique component names and following BEM, we add all the styles nested on the main selector, and make sure that we don't have elements in the component that are styled by an external stylesheet, unless it's from an UI framework (semantic) or a class util (e.g. `mt-20` = `margin top: 20px`). If a style is used in more than one component, then a new component can be created with those styles scoped, and use that in the other component.
- If I had an element that could potentially be either an element of a block or modifying an element, the latter is better because chaining modifiers can be confusing. More info [here](https://dockyard.com/blog/2015/01/05/avoid-chaining-modifiers).
- Chainable modifiers should never modify the same CSS property twice for a given module. Use a namespace which describe the change, e.g. size, color, width... and use generic descriptors, e.g. large, primary, dark... e.g. `btn btn--size-l btn--color-dark`.

### Further reading

* [Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css)
* [Battling BEM CSS: 10 Common Problems And How To Avoid Them](https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/)
* [CSS Specificity](http://cssguidelin.es/#specificity)
* [CSS Guidelines](https://github.com/chris-pearce/css-guidelines)