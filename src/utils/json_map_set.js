// JSON stringify + parse that work with Maps and Sets
function replacer(key, value) {
    if(value instanceof Map) {
        return {
            $type: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else if (value instanceof Set) {
        return {
            $type: 'Set',
            value: Array.from(value)
        }
    } else {
        return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.$type === 'Map') {
            return new Map(value.value);
        }
        if (value.$type === 'Set') {
            return new Set(value.value)
        }
    }
    return value;
}

export const stringify = a => JSON.stringify(a, replacer);
export const parse = s => JSON.parse(s, reviver);