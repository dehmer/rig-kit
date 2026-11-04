
/**
 *
 */
export default
    async millis =>
        new Promise((resolve) =>
            setTimeout(resolve, millis)
        )
