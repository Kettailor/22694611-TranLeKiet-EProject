require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/products",
  rabbitMQURI: process.env.RABBITMQ_URI,
  exchangeName: "products",
  queueName: "products_queue",
  jwtSecret: process.env.JWT_SECRET || "secret",
};
