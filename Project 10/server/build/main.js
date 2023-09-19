import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyIO from 'fastify-socket.io';
import closeWithGrace from 'close-with-grace';
dotenv.config();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://127.0.0.1:5500/';
async function buildServer() {
    const CONNECTION_COUNT_UPDATED_CHANNEL = 'chat:connection-count-updated';
    const NEW_MESSAGE_CHANNEL = 'chat:new-message';
    let connectedClients = 0;
    const app = fastify();
    await app.register(fastifyCors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    });
    await app.register(fastifyIO, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        },
    });
    app.io.on('connection', async (io) => {
        connectedClients++;
        await connection_count_updated();
        io.on(NEW_MESSAGE_CHANNEL, async (payload) => {
            const message = payload.message;
            if (!message) {
                return;
            }
            console.log('rest', message);
            await new_message(message.toString());
        });
        io.on('disconnect', async () => {
            connectedClients--;
            await connection_count_updated();
        });
    });
    app.get('/healthcheck', () => {
        return {
            status: 'ok',
            port: PORT,
        };
    });
    async function connection_count_updated() {
        app.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
            count: connectedClients,
        });
    }
    async function new_message(message) {
        app.io.emit(NEW_MESSAGE_CHANNEL, {
            message: message,
            id: randomUUID(),
            createdAt: new Date(),
        });
    }
    return app;
}
async function main() {
    const app = await buildServer();
    try {
        await app.listen({
            port: PORT,
            host: HOST,
        });
        closeWithGrace({ delay: 2000 }, async ({ signal, err }) => {
            await app.close();
        });
        console.log(`Server started at http://${HOST}:${PORT}`);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
