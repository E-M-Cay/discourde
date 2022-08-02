import { Request } from 'express';

export default interface IREQUEST extends Request{
    id?: number
    action?: number
    server_id?: number
}