export const inflate =
    compact =>
        compact.reduce((acc, entry) => {
            const [value, ...rest] = entry
            const from = rest[0]
            const to = rest.length == 2 ? rest[1] : rest[0]
            for (let i = from; i <= to; i++) acc[i] = value
            return acc
        }, {})
