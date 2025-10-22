require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGODB_ORDER_URI || "mongodb://localhost/orders",
  rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
  orderQueue: process.env.RABBITMQ_ORDER_QUEUE || "orders",
  productQueue: process.env.RABBITMQ_PRODUCT_QUEUE || "products",
  port: process.env.PORT || 3002,
};
  