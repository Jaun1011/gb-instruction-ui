
const projectBitLookup = (controller ) => {
    const inp = document.createElement("input");
    inp.style = 'width: 90%; margin: 5px';

    inp.addEventListener("input", () =>
        controller.setFilter({
            bitLookup: inp.value
        }))

    const head = document.createElement("th")
    head.appendChild(inp)
    head.colSpan = 8;
    return head;
}

const projectPrefixCheckbox = (controller, colspan = 1) => {
    const inp = document.createElement("input");
    inp.type = "checkbox";

    inp.addEventListener("input", (e) =>
        controller.setFilter({
            prefix: e.target.checked
        }));

    const head = document.createElement("th")
    head.appendChild(inp)
    head.colSpan = colspan;
    return head;
}

const tableHead = (value, colspan = 1,) => {
    const th = document.createElement("th");
    th.innerHTML = value;

    th.colSpan = colspan;
    return th
}

export const projectOpcodeTable = (controller) => {

    const tableHeader = document.createElement("thead");

    tableHeader.appendChild(tableHead("Num"));
    tableHeader.appendChild(projectPrefixCheckbox(controller))
    tableHeader.appendChild(tableHead("Hex"));


    tableHeader.appendChild(projectBitLookup(controller))

    tableHeader.appendChild(tableHead("mnemonic"));
    tableHeader.appendChild(tableHead("o1"));
    tableHeader.appendChild(tableHead("o2"));
    tableHeader.appendChild(tableHead("o3"));

    tableHeader.appendChild(tableHead("bytes"));
    tableHeader.appendChild(tableHead("Z"));
    tableHeader.appendChild(tableHead("N"));
    tableHeader.appendChild(tableHead("H"));
    tableHeader.appendChild(tableHead("C"));
    tableHeader.appendChild(tableHead("decoder"));


    const tableDistrict = (value, backgroundColor = "") => {
        const td = document.createElement("td");
        td.textContent = value;

        if (backgroundColor !== "")
            td.style = `background-color: ${backgroundColor}`;

        return td;
    }


    const tableBody = document.createElement("tbody")

    controller.onOpcodeChange(codes => {
        tableBody.innerHTML = "";
        for (const code of codes) {
            const row = document.createElement("tr")

            row.appendChild(tableDistrict(code.number));
            row.appendChild(tableDistrict(code.prefix));
            row.appendChild(tableDistrict(code.hex));

            for (let i = 0; i < 8; i++) {

                row.appendChild(tableDistrict(code.bin[i], code.binColors[i]));
            }

            row.appendChild(tableDistrict(code.mnemonic));

            for (let idx in code.operands) {
                row.appendChild(tableDistrict(code.operands[idx].name));
            }

            for (let idx = code.operands.length; idx < 3; idx++) {
                row.appendChild(tableDistrict(""));
            }

            row.appendChild(tableDistrict(code.bytes));

            // Fill empty operand cells
            for (let f in code.flags) {
                row.appendChild(tableDistrict(code.flags[f]));
            }


            row.appendChild(tableDistrict(`${code.hex} -> decode("${code.mnemonic} ${code.operands.map(o => o.name).join(", ")}", ${code.bytes - 1})`))
            tableBody.appendChild(row);
        }
    });


    const table = document.createElement("table")
    table.appendChild(tableHeader);
    table.appendChild(tableBody)
    return table;
}

