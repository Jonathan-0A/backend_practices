class ApiResponse {
    constructor (
        statusCode,
        data,
        message,
        success = false,
    ) {
        this.statusCode = statusCode
        this.data = data
        this.success = success
        this.message = message
        this.success = statusCode < 400 
    }
}

export { ApiResponse }