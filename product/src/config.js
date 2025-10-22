require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost/products",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
  orderQueue: process.env.RABBITMQ_ORDER_QUEUE || "orders",
  productQueue: process.env.RABBITMQ_PRODUCT_QUEUE || "products",
};
