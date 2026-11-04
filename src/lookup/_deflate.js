export const deflate = lookup => {
    const keys = Object.keys(lookup).map(x => parseInt(x)).sort((a, b) => a - b)

    const groups = keys.reduce((acc, key) => {
        const value = lookup[key]
        const group = acc[value] || [key, key]
        group[1] = key
        acc[value] = group
        return acc
    }, {})

    return Object.entries(groups).map(([k, v]) => {
        return v[0] === v[1]
            ? [parseFloat(k), v[0]]
            : [parseFloat(k), ...v]
    })
}
