import path from "node:path";
import * as fs from "fs";
import Tokenizer from "./tokenizer";
import Parser from "./parser";
import { CodeGenerator } from "./codegen";

// Testing Configuration
const testFileName = "variables";
const compilerMessage = "-- Compiled by DodoSeal :)\n\n";

// Tokenize and Parse source code
const testFilePath = path.join(__dirname, `../src/examples/${testFileName}.ts`);
const sourceCode = fs.readFileSync(testFilePath, { encoding: "utf-8" }).toString();
const debugTokenizer = new Tokenizer(sourceCode);
const tokenOutput = debugTokenizer.Tokenize();
const debugParser = new Parser(tokenOutput);
const astOutput = debugParser.Parse();

// Output the AST
// console.dir(astOutput, { depth: null });

// Output the compiled AppleScript
const debugGenerator = new CodeGenerator();
let outputCode = `${compilerMessage}tell application id "com.figure53.QLab.5" to tell front workspace\n\n`;

for (let node of astOutput.body) {
    const code = debugGenerator.Generate(node);

    outputCode += code;
    outputCode += "\n"
};

outputCode += "\nend tell";

const outputPath = path.join(__dirname, `../src/examples/${testFileName}-compiled.applescript`);
fs.writeFileSync(outputPath, outputCode, { encoding: "utf-8" });
console.log(`Compiled TS to AppleScript!`);