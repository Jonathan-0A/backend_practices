class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong !",
        data,
        error = [],
        stack = {},
        success
    ) {
        super(message)
        this.statusCode = statusCode
        this.errors = error
        this.data = data
        success = false
        this.message = message

        if (stack) {
            this.stack = stack.stack
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }