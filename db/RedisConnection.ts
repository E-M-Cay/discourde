import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://default:Pe1pv1Fh58lmagb26EjVzB00KbiQw0B5@redis-19499.c269.eu-west-1-3.ec2.cloud.redislabs.com:19499',
});

redisClient.on('error', (err: any) => //console.log('Redis Client Error', err));

redisClient
  .connect()
  .then(() => {
    //console.log('Redis connection established');
  })
  .catch((err) => {
    console.error('Error during Redis connection', err);
  });

export { redisClient };
