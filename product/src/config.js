require("dotenv").config();

const DEFAULT_PORT = 3001;
const DEFAULT_MONGO_URI = "mongodb://localhost:27017/products";
const DEFAULT_RABBIT_URI = "amqp://localhost";
const DEFAULT_ORDER_QUEUE = "orders";
const DEFAULT_PRODUCT_QUEUE = "products";
const DEFAULT_JWT_SECRET = "secret";
const DEFAULT_RABBIT_CONNECT_DELAY_MS = 20000;

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/products",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
  orderQueue: process.env.RABBITMQ_ORDER_QUEUE || "orders",
  productQueue: process.env.RABBITMQ_PRODUCT_QUEUE || "products",
};
