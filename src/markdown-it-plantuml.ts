import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import {Options} from "markdown-it/lib";
import Renderer from "markdown-it/lib/renderer";

const plantumlEncoder = require("plantuml-encoder");



export
type PlantumlOutputValues = "svg" | "img" | "txt";

export
enum PlantumlOutput {
    SVG = "svg",
    IMG = "img",
    TXT = "txt"
}

export
type PlantumlOutputType = PlantumlOutput;

export
interface PlantumlRenderInfo {
    lang?: string,
    token?: Token,
    chunks?: string[],
    code?: string,
    encoded?: string,
    output_type?: PlantumlOutput,
    alt?: string,
    final_url?: string,
    server?:string,
    opts?: PlantumlOnlineOptions,
}

export
interface PlantumlOnlineOptions {
    server?: string;
    output_type?: PlantumlOutputType;
    render_f?: (result: PlantumlRenderInfo) => string;
}

export
function render_default(render_info: PlantumlRenderInfo): string {
    switch (render_info.output_type) {
        case "img": {
            return `<img alt="${render_info.alt}" src="${render_info.final_url}"/>\n`;
        }
        case "svg": {
            return `<object data="${render_info.final_url}" type="image/svg+xml"></object>\n`
        }
        case "txt": {
            return `<pre><object width="100%" data="${render_info.final_url}" type="text/plain"></object></pre>\n`
        }
    }
    throw new Error("Unknown output type")
}

const DefaultPlantumlOnlineOptions: PlantumlOnlineOptions = {
    server: 'http://www.plantuml.com/plantuml',
    output_type: PlantumlOutput.IMG
}

function getFirst<V extends string>(inArray: string[], ofArray: V[]): null | V {
    const ofValues = new Set();
    for (const x of ofArray) {
        ofValues.add(x);
    }
    for (const testValue of inArray) {
        if (ofValues.has(testValue)) {
            //return testValue;
            for (const x of ofArray) {
                if (x === testValue) {
                    return x;
                }
            }
        }
    }
    return null;
}

function EnumAsArray(someEnum: typeof PlantumlOutput): PlantumlOutputValues[] {
    return Object.values(someEnum);
}

function ResolveOutputType(chunks: string[], opts?:PlantumlOnlineOptions): PlantumlOutput {
    const def = DefaultPlantumlOnlineOptions;
    let outputType: PlantumlOutput = def.output_type ? def.output_type : PlantumlOutput.IMG;
    if(opts && opts.output_type) {
        outputType = opts.output_type;
    }
    const foundType = getFirst<PlantumlOutputValues>(chunks, EnumAsArray(PlantumlOutput));
    if (foundType !== null) {
        //find
        for (const x of Object.values(PlantumlOutput)) {
            if (x === foundType) {
                outputType = x;
                break
            }
        }
    }
    return outputType;
}


// @ts-ignore
export const PlantumlOnlinePlugin = (md: MarkdownIt, opts?: PlantumlOnlineOptions) => {
    const tempFence = md.renderer.rules.fence!.bind(md.renderer.rules)!;

    md.renderer.rules.fence = (tokens: Token[], idx: number, options: Options, env: any, slf: Renderer) => {
        const token = tokens[idx];
        const chunks = (token.info || ``).match(/^(\S+)(\s+(.+))?/);

        if (!chunks || !chunks.length || (chunks[1]!=="plantuml")) {
            return tempFence(tokens, idx, options, env, slf);
        }

        const code = token.content.trim();
        const server = opts? (opts.server?opts.server:DefaultPlantumlOnlineOptions.server) : DefaultPlantumlOnlineOptions.server;
        const renderinfo: PlantumlRenderInfo = {
            opts: { ...opts},
            chunks,
            token,
            lang: chunks[1],
            code: code,
            output_type: ResolveOutputType(chunks, opts),
            alt: 'to do',
            server: server,
            encoded: plantumlEncoder.encode(code),
        };
        renderinfo.final_url = `${renderinfo.server}/${renderinfo.output_type}/${renderinfo.encoded}`;
        let render_f = opts? (opts.render_f?opts.render_f:null): null;
        if (render_f==null) {
            render_f = render_default;
        }
        return render_f(renderinfo);
    };

    // const tempRender = md.renderer.render.bind(md.renderer);
    // md.renderer.render = (tokens: Token[], options: any, env: any) => {
    //     return `${tempRender(tokens, options, env)}`;
    // };
};
export default PlantumlOnlinePlugin;
