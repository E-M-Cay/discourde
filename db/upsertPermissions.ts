import { DataSource } from 'typeorm';
import { Permission } from '../entities/Permission';
import Permissions from '../types/Permissions';
import AppDataSource from './AppDataSource';

const upsertPermissions = async () => {
    console.log('inserting permissions');
    const permissionRepository = AppDataSource.getRepository(Permission);

    await permissionRepository.upsert({ name: Permissions.CAN_INVITE }, [
        'name',
    ]);

    await permissionRepository.upsert({ name: Permissions.CAN_KICK }, ['name']);

    await permissionRepository.upsert(
        { name: Permissions.CAN_MANAGE_CHANNEL },
        ['name']
    );

    await permissionRepository.upsert(
        { name: Permissions.CAN_MANAGE_HIDDEN_CHANNEL },
        ['name']
    );

    await permissionRepository.upsert(
        { name: Permissions.CAN_MANAGE_MESSAGE },
        ['name']
    );

    await permissionRepository.upsert({ name: Permissions.CAN_MUTE }, ['name']);

    await permissionRepository.upsert({ name: Permissions.CAN_SEE_HIDDEN }, [
        'name',
    ]);

    console.log('Done');
};

export default upsertPermissions;
