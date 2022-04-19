export function unique(arr) {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
}
export function difference(a, b) {
    const arr = new Array();
    for (const e of a) {
        if (!b.includes(e)) {
            arr.push(e);
        }
    }
    return arr;
}
