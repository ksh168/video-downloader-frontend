import { NextResponse } from 'next/server';
import amqp from 'amqplib';

export async function POST(request: Request) {
  if (!process.env.CLOUDAMQP_URL) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const { url } = await request.json();

    // Connect to CloudAMQP
    const connection = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await connection.createChannel();
    const queue = process.env.QUEUE_NAME || "";

    await channel.assertQueue(queue, { durable: true });

    // Send message to queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ url })), {
      persistent: true,
    });

    await channel.close();
    await connection.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 