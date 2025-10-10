const amqp = require("amqplib");
const config = require("../config");

class MessageBroker {
  constructor() {
    this.channel = null;
  }

  async connect() {
    console.log("Connecting to RabbitMQ...");

     try {
      const connection = await amqp.connect(process.env.RABBITMQ_URI || "amqp://guest:guest@rabbitmq:5672");
      connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err.message);
        setTimeout(() => this.connect(), this.reconnectDelay);
      });
      connection.on("close", () => {
        console.warn("RabbitMQ connection closed, retrying...");
        setTimeout(() => this.connect(), this.reconnectDelay);
      });

      this.channel = await connection.createChannel();
      await this.channel.assertQueue("products");

      console.log("RabbitMQ connected successfully");
    } catch (err) {
      console.error("Failed to connect:", err.message);
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }

  async consumeMessage(queue, callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MessageBroker();
