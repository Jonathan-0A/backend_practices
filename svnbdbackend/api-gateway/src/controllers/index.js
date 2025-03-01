export const healthCheck = (req, res) => {
    res.status(200).json({ message: "API Gateway is running!" });
};

// Add more controller functions as needed for your routes.