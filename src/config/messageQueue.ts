import amqplib from 'amqplib'
const rabbit = amqplib.connect('amqp://localhost')
import eventsEmitter from '../events/events'

export default class MessageQueue {
    /**
     * Initialize RabbitMQ
     */
    private static async connect(){
        return await (await rabbit).createChannel()
    }

    /**
     * Publishes data to the queue
     * @param channel 
     * @param data 
     */
    public static async publish(channel:string, data:unknown): Promise<void>{
        try {
            const dataToPublish = JSON.stringify(data)
            const process = await this.connect()
            await process.assertQueue(channel)
            process.sendToQueue(channel, Buffer.from(dataToPublish))
            process.close()
        } catch (error) {
            console.log('Error publishing data >>> ', error)
        }
    }

    /**
     * Consume published data from a channel
     * @param channel channel to consume data from
     * @param event associated event to be triggered
     */
    public static async consume(channel:string, event:string): Promise<void> {
        try {
            const process = await this.connect()
            process.assertQueue(channel)
            process.consume(channel, (message)=> {
                if(message !== null){
                    const data = JSON.parse(message.content.toString())
                    // emit an event to call the appropriate function
                    eventsEmitter.emit(event, data)
                    process.ack(message)
                    process.close()
                }
            })
        } catch (error) {
            console.log('Error consuming data >>> ', error)
        }
    }
}