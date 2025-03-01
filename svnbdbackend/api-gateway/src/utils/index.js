export const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};