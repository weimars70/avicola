import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('notifications')
export class NotificationsController {
  constructor(private jwtService: JwtService) {}
  @Get('stream')
  async getNotificationStream(@Query('token') token: string, @Res() res: Response) {
    // Validar token JWT
    if (!token) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    try {
      const decoded = this.jwtService.verify(token);
      if (!decoded) {
        return res.status(401).json({ message: 'Token inválido' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    // Configurar headers para Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    // Enviar mensaje inicial
    res.write('data: {"type":"connected","message":"Conectado al sistema de notificaciones"}\n\n');

    // Mantener la conexión abierta
    const keepAlive = setInterval(() => {
      res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
    }, 30000);

    // Limpiar cuando se cierre la conexión
    res.on('close', () => {
      clearInterval(keepAlive);
    });
  }
}