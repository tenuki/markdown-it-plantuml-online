# markdown-it-plugin-pikchr

[![Actions Status](https://github.com/tenuki/markdown-it-plantuml-online/workflows/On%20Commit%20Build%20and%20Tests/badge.svg)](https://github.com/tenuki/markdown-it-pikchr/actions)
[![Actions Status](https://github.com/tenuki/markdown-it-plantuml-online/workflows/On%20new%20release%20Build%20and%20Tests/badge.svg)](https://github.com/tenuki/markdown-it-pikchr/actions)

### How to add Pikchr support to Markdown-It

Use `markdown-it-plantuml-online` as a regular plugin.

```sh
npm install markdown-it markdown-it-plantuml-online
```

Configure the markdown-it instance:

```javascript
// node.js, "classic" way:
var plantuml = require('markdown-it-plantuml-online');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
    md.use(plantuml);   // md.use(plantuml, {..})   with options
var result = md.render(aMarkdownDocument);
```

Document including:

        ```plantuml
        @startuml
        
        [*] --> State1
        State1 --> [*]
        State1 : this is a string
        State1 : this is another string
        
        State1 -> State2
        State2 --> [*]
        
        @enduml
        ```


----
Code based on: https://github.com/christianvoigt/argdown/tree/master/packages/argdown-markdown-it-plugin
