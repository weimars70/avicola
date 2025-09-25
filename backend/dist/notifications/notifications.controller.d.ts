import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class NotificationsController {
    private jwtService;
    constructor(jwtService: JwtService);
    getNotificationStream(token: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
