## Component Guidelines

### Tips & Tricks

- Keep components small. By splitting long components into smaller ones, you are able to reduce the size of page stylesheets by creating more stylesheets for each component, which are easier to reason about.
- Page components should have mostly only layout and top components in order to keep them small, and leave the business logic to Redux or React context.

### Further reading

* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [Writing Resilient Components](https://overreacted.io/writing-resilient-components/)