const fs = require("fs");

export const parseTemplate = (filePath: string, options: { [key: string]: any }, callback: (e: any, rendered?: string) => void) => {
    fs.readFile(filePath, (err: any, content: string) => {
        if (err) return callback(err);
        // this is an extremely simple template engine
        let rendered = content.toString();

        try {
            rendered = replaceLogics(rendered, options);

            rendered = replaceVariables(rendered, options);
        } catch (e: any) {
            console.log("shit");
            return parseTemplate("src/views/error.html", { message: e.message, stack: e.stack, status: 500 }, callback);
        }

        return callback(null, rendered);
    });
};

const replaceVariables = (template: string, variables: { [key: string]: string | number | object }): string => {
    let rendered = template;
    let matches = rendered.match(/{{\s*[\w\.]+\s*}}/g);

    if (matches) {
        matches.forEach((match) => {
            let key = match.replace("{{", "").replace("}}", "").trim();
            let value: any;
            if (key.includes(".")) {
                let keys = key.split(".");
                value = variables;
                keys.forEach((key) => {
                    value = value[key];
                });
            } else {
                value = variables[key];
            }
            if (!value) {
                throw new Error(`Variable ${key} not found`);
            }
            rendered = rendered.replace(match, value);
        });
    }
    return rendered;
};

const replaceLogics = (template: string, variables: { [key: string]: string | number | [any] }): string => {
    let rendered = template;

    let forLoopMatches = rendered.match(/{% for[\s\S]*?%}[\s\S]*?{% endfor %}/g);
    let conditionMatches = rendered.match(/{% if[\s\S]*?%}[\s\S]*?{% endif %}/g);

    if (forLoopMatches) {
        forLoopMatches.forEach((match) => {
            let forLoopRendered = handleForLoop(match, variables);
            rendered = rendered.replace(match, forLoopRendered);
        });
    }

    if (conditionMatches) {
        conditionMatches.forEach((match) => {
            let conditionRendered = handleCondition(match, variables);
            rendered = rendered.replace(match, conditionRendered);
        });
    }

    return rendered;
};

const handleForLoop = (forLoopString: string, variables: { [key: string]: string | number | [any] }): string => {
    let rendered = forLoopString;

    const loopVariableRegex = /\{% for\s+(\w+)\s+in\s+\w+\s+%\}/;
    const loopVariableMatch = forLoopString.match(loopVariableRegex);
    const loopVariable = loopVariableMatch ? loopVariableMatch[1] : null;

    const arrayRegex = /\{% for\s+\w+\s+in\s+(\w+)\s+%\}/;
    const arrayMatch = forLoopString.match(arrayRegex);
    const arrayName = arrayMatch ? arrayMatch[1] : null;

    if (!loopVariable || !arrayName) {
        throw new Error("Invalid for loop syntax");
    }

    const array = variables[arrayName];
    if (!array || !Array.isArray(array)) {
        throw new Error(`Array ${arrayName} not found`);
    }

    let loopContentRegex = /\{% for[\s\S]*?%}([\s\S]*?){% endfor %}/;
    let loopContentMatch = forLoopString.match(loopContentRegex);
    let loopContent = loopContentMatch ? loopContentMatch[1] : null;

    if (!loopContent || loopContent.length === 0 || loopContent.trim().length === 0) {
        return "";
    }

    let loopContentRendered = "";
    array.forEach((item: any) => {
        let loopContentRenderedItem = loopContent || "";
        loopContentRenderedItem = replaceVariables(loopContentRenderedItem, { [loopVariable]: item });
        //Check if there is a nested if
        let conditionMatches = loopContentRenderedItem.match(/{% if[\s\S]*?%}[\s\S]*?{% endif %}/g);
        if (conditionMatches) {
            conditionMatches.forEach((match) => {
                let conditionRendered = handleCondition(match, { ...variables, [loopVariable]: item });

                loopContentRenderedItem = loopContentRenderedItem.replace(match, conditionRendered);
            });
        }
        loopContentRendered += loopContentRenderedItem;
    });

    rendered = loopContentRendered;

    return rendered;
};
const handleCondition = (conditionString: string, variables: { [key: string]: string | number | [any] }): string => {
    console.log(conditionString);
    console.log(variables);
    const conditionRegex = /\{% if\s+([\w\.\s\(\)\>\<\=\!\'\"]+)\s+%\}/;
    const conditionMatch = conditionString.match(conditionRegex);
    const condition = conditionMatch ? conditionMatch[1] : null;

    if (!condition) {
        throw new Error("Invalid if condition syntax");
    }

    let conditionContentRegex = /\{% if[\s\S]*?%}([\s\S]*?){% endif %}/;
    let conditionContentMatch = conditionString.match(conditionContentRegex);
    let conditionContent = conditionContentMatch ? conditionContentMatch[1] : null;

    if (!conditionContent || conditionContent.length === 0 || conditionContent.trim().length === 0) {
        return "";
    }

    //Divide content to separate else if conditions
    let elseIfRegex = /\{% elseif\s+([\p{L}\w\.\s()><=!'"]+)\s+%\}/gu;
    let elseIfMatches = conditionContent.match(elseIfRegex);
    let elseIfConditions: string[] = [];
    let elseIfContents: string[] = [];
    if (elseIfMatches) {
        elseIfMatches.forEach((match) => {
            let elseIfContent = conditionContent!.split(match);
            elseIfContent = elseIfContent.map((content) => content.substring(0, content.indexOf("{%")).trim());
            elseIfConditions.push(match.replace("{% elseif ", "").replace(" %}", "").trim());
            elseIfContents.push(elseIfContent[1]);
        });
    }

    //Divide content to separate else condition
    let elseRegex = /\{% else\s+%}/;
    let elseMatch = conditionContent.match(elseRegex);
    let elseContent: string | null = null;
    if (elseMatch) {
        elseContent = conditionContent.split(elseMatch[0])[1];
        elseContent = elseContent.trim();
    }

    let renderContent = "";

    if (evaluateCondition(condition, variables)) {
        renderContent = conditionContent.substring(0, conditionContent.indexOf("{%")).trim();
        return renderContent;
    }

    if (elseIfConditions.length > 0) {
        for (let i = 0; i < elseIfConditions.length; i++) {
            let elseIfCondition = elseIfConditions[i];
            let elseIfContent = elseIfContents[i];
            if (evaluateCondition(elseIfCondition, variables)) {
                renderContent = elseIfContent;
                return renderContent;
            }
        }
    }

    if (elseContent) {
        return elseContent;
    }

    return "";
};

const evaluateCondition = (condition: string, variables: { [key: string]: string | number | [any] }): boolean => {
    let result = false;

    const variableRegex = /(?<!['"])\b[\w\.]+\b(?!['"])/g;
    const matches = condition.match(variableRegex);
    const variablesInCondition = matches ? matches.filter((match) => !["true", "false", "null", "undefined"].includes(match)) : [];
    if (variablesInCondition) {
        variablesInCondition.forEach((match) => {
            let localVariableToAccess = "variables";
            let keys = match.split(".");
            keys.forEach((key) => {
                localVariableToAccess += `['${key}']`;
            });

            condition = condition.replace(match, localVariableToAccess);
        });
    }

    try {
        result = eval(condition);
    } catch (e: any) {
        throw new Error(`Error evaluating condition: ${e.message}`);
    }

    return result;
};
