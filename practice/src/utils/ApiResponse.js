class ApiResponse {
    constructor (
        statusCode,
        message,
        data,
        success,
    ) {
        this.statusCode = statusCode
        this.data = data
        this.success = success
        this.message = message
        this.success = statusCode < 400 
    }
}

export { ApiResponse }