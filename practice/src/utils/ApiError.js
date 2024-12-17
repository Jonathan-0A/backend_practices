class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong !",
        error = [],
        stack = {},
        successs
    ) {
        super(message)
        this.statusCode = statusCode
        this.errors = error
        this.data = null
        successs = false
        this.message = message

        if (stack) {
            this.stack = stack.stack
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }