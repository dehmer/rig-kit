
/**
 *
 */
export default n =>
    v =>
        "$" + v
            .toString(16)
            .padStart(n, '0')
            .toUpperCase()
