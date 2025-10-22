require("dotenv").config();

const DEFAULT_PORT = 3001;
const DEFAULT_MONGO_URI = "mongodb://localhost:27017/products";
const DEFAULT_RABBIT_URI = "amqp://guest:guest@rabbitmq";
const DEFAULT_ORDER_QUEUE = "orders";
const DEFAULT_PRODUCT_QUEUE = "products";
const DEFAULT_JWT_SECRET = "secret";
const DEFAULT_RABBIT_CONNECT_DELAY_MS = 20000;

const normalizeRabbitUri = (uri) => {
  try {
    const parsed = new URL(uri);

    if (parsed.hostname === "localhost") {
      parsed.hostname = "127.0.0.1";
    }

    if (parsed.port === "15672" && parsed.protocol === "amqp:") {
      parsed.port = "5672";
    }

    const normalized = parsed.toString();
    return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  } catch (err) {
    return uri;
  }
};

module.exports = {
  port: Number(process.env.PORT) || DEFAULT_PORT,
  mongoURI: process.env.MONGODB_PRODUCT_URI || DEFAULT_MONGO_URI,
  rabbitMQURI: normalizeRabbitUri(process.env.RABBITMQ_URI || DEFAULT_RABBIT_URI),
  orderQueue: process.env.RABBITMQ_ORDER_QUEUE || DEFAULT_ORDER_QUEUE,
  productQueue: process.env.RABBITMQ_PRODUCT_QUEUE || DEFAULT_PRODUCT_QUEUE,
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  rabbitMQConnectDelayMs:
    Number(process.env.RABBITMQ_CONNECT_DELAY_MS) || DEFAULT_RABBIT_CONNECT_DELAY_MS,
};
