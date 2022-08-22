import { Channel } from '../entities/Channel';
import { Server } from '../entities/Server';
import { VocalChannel } from '../entities/VocalChannel';
import AppDataSource from './AppDataSource';

const vocalChannelRepository = AppDataSource.getRepository(VocalChannel);
const channelRepository = AppDataSource.getRepository(Channel);
const serverRepository = AppDataSource.getRepository(Server);

const upsertHomeServer = async () => {
  if (
    await serverRepository.count({
      where: {
        id: 1,
      },
    })
  ) {
    return;
  }
  console.log('upserting main server');

  const vocalChan = vocalChannelRepository.create({
    name: 'Forum',
    id: 1,
  });
  const textChan = channelRepository.create({
    name: 'Général',
    id: 1,
  });
  const newMainServ = serverRepository.create({
    name: 'Général',
    id: 1,
    channels: [textChan],
    vocalChannels: [vocalChan],
  });
  await serverRepository.save(newMainServ);

  console.log('done with main server');
};

export default upsertHomeServer;
