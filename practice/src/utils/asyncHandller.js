// const asyncHandler = (reqHandler) => {
//     async (req, res, next) => {
//         try {
//             await reqHandler(req, res, next);
//         } catch (err) {
//             res.status(err.code || 500).json({
//                 success: false,
//                 message: err.message || "Internal Server Error",
//             })
//         }
//     }
// }

const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch(
            (err) => {
                next(err)
            }
        )
    }
}

export { asyncHandler }