import * as fs from "fs";
import process from "process";
import { Cell } from "@ton/core";
import { compileFunc } from "@ton-community/func-js";

async function compileScript() {
    console.log("=".repeat(100))
    console.log("Compiling starting...")

    const compileResult = await compileFunc({
        targets: ["./contracts/main.fc"],
        sources: (x) => fs.readFileSync(x).toString("utf-8"),
    })

    if (compileResult.status === "error") {
        console.log("Compiling errors occured!")
        console.log(`\n${compileResult.message}`)
        process.exit(1);
    }

    const hexArtifact = "build/main.compile.json";

    fs.writeFileSync(
        hexArtifact,
        JSON.stringify({
            hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc, "base64"))[0]
                .toBoc()
                .toString("hex")
        })
    )

    console.log(`Compilation successfull!\nCompiled code saved to - ${hexArtifact}`)
}

compileScript()
