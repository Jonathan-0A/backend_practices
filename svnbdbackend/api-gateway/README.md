# API Gateway

This project is an API Gateway that serves as a single entry point for multiple microservices. It is built using Node.js and Express.

## Project Structure

- **src/app.js**: Entry point of the application. Initializes the Express app and sets up middleware.
- **src/routes/index.js**: Defines the API endpoints and links them to the appropriate controllers.
- **src/controllers/index.js**: Contains the logic for handling requests for each endpoint.
- **src/utils/index.js**: Utility functions for logging, error handling, and other shared functionalities.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **.env**: Contains environment variables for configuration.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd api-gateway
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables.

5. Start the application:
   ```
   npm start
   ```

## Usage

Once the application is running, you can access the API Gateway at `http://localhost:<port>`, where `<port>` is defined in your `.env` file or defaults to 3000.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.