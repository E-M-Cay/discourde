import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://Jeje:Jeje@dmin1@redis-19499.c269.eu-west-1-3.ec2.cloud.redislabs.com:19499',
});

redisClient.on('error', (err: any) => console.log('Redis Client Error', err));

const connectRedisClient = async () => {
  await redisClient.connect();
  console.log(redisClient);
};

export { connectRedisClient, redisClient };
