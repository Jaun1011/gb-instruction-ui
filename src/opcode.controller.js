import {Observable} from "../lib/kolibri.js";
import {opcodes} from "../lib/opcodes.js";

export const OpCodeController = () => {


    /**
     * Creates a lookup array from the given opcodes and prefix.
     * @param opcodes
     * @param prefix
     * @returns {(*&{prefix: *, hasPrefix: boolean, number: number, bin: string, hex: *})[]}
     */
    const createLookup = (opcodes, prefix) => Object
        .keys(opcodes)
        .map(key => {
            const num = parseInt(key, 16);
            const bin = num.toString(2).padStart(8, "0")
            return {
                ...{
                    prefix,
                    hasPrefix: prefix !== '',
                    number: num,
                    bin,
                    hex: key
                },
                ...opcodes[key],
            }
        })


    const lookup = createLookup(opcodes.unprefixed, '').concat(createLookup(opcodes.cbprefixed, '0xCB'));

    const $opcodes = Observable(lookup);

    /**
     * Filters the opcode list based on the provided filter.
     * @param filter @type {{prefix: boolean, bitLookup: string}}
     */
    const filterOpcode = (filter) => {
        const value = filter.bitLookup
            .replaceAll(' ', '')
            .trim()
            .padEnd(8, '-');

        const filtered = lookup
            .filter(n => n.hasPrefix === filter.prefix)
            .filter(n => {

                let i = 0;

                while (i < value.length) {
                    if ((value[i] === '0' || value[i] === '1') && value[i] !== n.bin[i]) {
                        return false;
                    }
                    i++;
                }
                return true;
            })
            .map(n => {
                return {
                    ...n,
                    binColors: value.split('').map((b) => {

                        if(b === '-') return 'none';
                        if((b === '0' ||  b === '1')) return '#cfcfcf';


                        return `#${(b.charCodeAt() * 343).toString(16).padStart(6, '0')}` ;
                    })
                };
            });

        $opcodes.setValue(filtered);
    }

    const $filters = Observable({
        prefix: false,
        bitLookup: '',
    });


    $filters.onChange( filterOpcode )

    const setFilter = (newFilter) => {
        $filters.setValue({
            ...$filters.getValue(),
            ...newFilter
        });
    }

    return {
        onOpcodeChange: $opcodes.onChange,
        filterOpcode,
        setFilter
    }
}


