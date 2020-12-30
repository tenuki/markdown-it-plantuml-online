import {expect} from "chai";
import {describe, it} from "mocha";
import PlantumlOnlinePlugin, {PlantumlRenderInfo} from "../src/markdown-it-plantuml";

const MarkdownIt = require("markdown-it");


const StateDiagramSrc = `
@startuml

[*] --> State1
State1 --> [*]
State1 : this is a string
State1 : this is another string

State1 -> State2
State2 --> [*]

@enduml`


describe("Basic testing", function () {
    const mdi = new MarkdownIt();
    mdi.use(PlantumlOnlinePlugin);

    it("regular mode", function () {
        const result = mdi.render(`
# Markdown header
Some *Markdown* text before the code fences.
\`\`\`plantuml
Bob -> Alice: Hello!
\`\`\``);
        expect(result.slice(result.indexOf("<img"))).to.equals(
            `<img alt="to do" src="http://www.plantuml.com/plantuml/img/SyfFKj2rKt3CoKnEjLBmICt9oLS40000"/>\n`
        );
    });

    it("state diagram", function () {
        const result = mdi.render(`
# Markdown header
Some *Markdown* text before the code fences.
\`\`\`plantuml
${StateDiagramSrc}
\`\`\``);
        expect(result.slice(result.indexOf("<img"))).to.equals(
            `<img alt="to do" src="http://www.plantuml.com/plantuml/img/SoWkIImgAStDuUAArefLqDMrKmWkIIn9DUI2K60He0oCQwLGaf5Ph014YGh59KMPUUbOPFBoIp9IYs3oS9EWHXj118pWHdCvfEQb09q00000"/>\n`);
    });

    it("state diagram - svg", function () {
        const result = mdi.render(`
# Markdown header
Some *Markdown* text before the code fences.
\`\`\`plantuml svg
${StateDiagramSrc}
\`\`\``);
        const body = `<h1>Markdown header</h1>
<p>Some <em>Markdown</em> text before the code fences.</p>
<object data=`;
        const after = ` type="image/svg+xml"></object>\n`

        expect(result).to.equals(
            body +
            `"http://www.plantuml.com/plantuml/svg/SoWkIImgAStDuUAArefLqDMrKmWkIIn9DUI2K60He0oCQwLGaf5Ph014YGh59KMPUUbOPFBoIp9IYs3oS9EWHXj118pWHdCvfEQb09q00000"` +
            after);
    });

    it("state diagram - txt", function () {
        const result = mdi.render(`
# Markdown header
Some *Markdown* text before the code fences.
\`\`\`plantuml txt
${StateDiagramSrc}
\`\`\``);
        const body = `<h1>Markdown header</h1>
<p>Some <em>Markdown</em> text before the code fences.</p>
<pre><object width="100%" data=`;
        const after = ` type="text/plain"></object></pre>\n`;

        expect(result).to.equals(
            body +
            `"http://www.plantuml.com/plantuml/txt/SoWkIImgAStDuUAArefLqDMrKmWkIIn9DUI2K60He0oCQwLGaf5Ph014YGh59KMPUUbOPFBoIp9IYs3oS9EWHXj118pWHdCvfEQb09q00000"` +
            after);
    });

});


describe("Testing Options - rendering function", function () {
    const sample_output = "sample output sample output";

    // @ts-ignore
    function render_f(render_info: PlantumlRenderInfo): string {
        const expected = {
            "opts": {
                render_f
            },
            "chunks": ["plantuml", "plantuml", undefined, undefined],
            "token": {
                "type": "fence",
                "tag": "code",
                "attrs": null,
                "map": [3, 6],
                "nesting": 0,
                "level": 0,
                "children": null,
                "content": "arrow; arrow\n",
                "markup": "```",
                "info": "plantuml",
                "meta": null,
                "block": true,
                "hidden": false
            },
            "lang": "plantuml",
            "code": "arrow; arrow",
            "output_type": "img",
            "alt": "to do",
            "server": "http://www.plantuml.com/plantuml",
            "encoded": "IomgoY-tLaW4KG00",
            "final_url": "http://www.plantuml.com/plantuml/img/IomgoY-tLaW4KG00"
        }
        expect(JSON.stringify(render_info)).to.equals(JSON.stringify(expected));
        return sample_output;
    }

    const mdi = new MarkdownIt();
    mdi.use(PlantumlOnlinePlugin, {render_f});

    it("regular mode", function () {
        const result = mdi.render(`
# Markdown header
Some *Markdown* text before the code fences.
\`\`\`plantuml
arrow; arrow
\`\`\``);
        expect(result).to.equals(`<h1>Markdown header</h1>
<p>Some <em>Markdown</em> text before the code fences.</p>\n` + sample_output);
    });
});


describe("Testing  - Different server", function () {
    const sample_output = "sample output sample output";

    // @ts-ignore
    function render_f(render_info: PlantumlRenderInfo): string {
        const expected = {
            "opts": {
                render_f,
                server: 'http://localhost:8080/plantuml'
            },
            "chunks": ["plantuml", "plantuml", undefined, undefined],
            "token": {
                "type": "fence",
                "tag": "code",
                "attrs": null,
                "map": [2, 5],
                "nesting": 0,
                "level": 0,
                "children": null,
                "content": "arrow; arrow\n",
                "markup": "```",
                "info": "plantuml",
                "meta": null,
                "block": true,
                "hidden": false
            },
            "lang": "plantuml",
            "code": "arrow; arrow",
            "output_type": "img",
            "alt": "to do",
            "server": "http://localhost:8080/plantuml",
            "encoded": "IomgoY-tLaW4KG00",
            "final_url": "http://localhost:8080/plantuml/img/IomgoY-tLaW4KG00"
        }
        expect(JSON.stringify(render_info)).to.equals(JSON.stringify(expected));
        return sample_output;
    }

    const mdi = new MarkdownIt();
    mdi.use(PlantumlOnlinePlugin, {render_f, server: 'http://localhost:8080/plantuml'});

    it("regular mode", function () {
        const result = mdi.render(`
# Markdown header
\`\`\`plantuml
arrow; arrow
\`\`\``);
        expect(result).to.equals(`<h1>Markdown header</h1>\n` + sample_output);
    });
});
