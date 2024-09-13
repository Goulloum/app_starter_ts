const fs = require("fs");

export const parseTemplate = (filePath: string, options: { [key: string]: any }, callback: (e: any, rendered?: string) => void) => {
    fs.readFile(filePath, (err: any, content: string) => {
        if (err) return callback(err);
        // this is an extremely simple template engine
        let rendered = content.toString();

        try {
            rendered = replaceVariables(rendered, options);
        } catch (e: any) {
            console.log("shit");
            return parseTemplate("src/views/error.html", { message: e.message, stack: e.stack, status: 500 }, callback);
        }

        return callback(null, rendered);
    });
};

const replaceVariables = (template: string, variables: { [key: string]: string }) => {
    let rendered = template;
    let matches = rendered.match(/{{\s*[\w\.]+\s*}}/g);

    if (matches) {
        matches.forEach((match) => {
            let key = match.replace("{{", "").replace("}}", "").trim();
            let value = variables[key];
            if (!value) {
                throw new Error(`Variable ${key} not found`);
            }
            rendered = rendered.replace(match, value);
        });
    }
    return rendered;
};
