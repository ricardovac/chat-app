import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { AppService } from 'src/app.service';
import { Server } from 'typeorm';
import { Chat } from 'src/chat.entity';

export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private appService: AppService) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
    await this.appService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnect: ${client}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected: ${client}`);
  }
}
