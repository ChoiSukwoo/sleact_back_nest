import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dms } from 'src/entities/Dms';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { EventsGateway } from 'src/events/events.gateway';
import { onlineMap, namespaceMap } from 'src/events/onlineMap';
import { MoreThan, Repository } from 'typeorm';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Dms) private dmsRepository: Repository<Dms>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async getWorkspaceDMChats(
    url: string,
    id: number,
    myId: number,
    perPage: number,
    page: number,
    skip: number = 0,
  ) {
    return this.dmsRepository
      .createQueryBuilder('dms')
      .innerJoinAndSelect('dms.sender', 'sender')
      .innerJoinAndSelect('dms.receiver', 'receiver')
      .innerJoin('dms.workspace', 'workspace', 'workspace.url = :url', { url })
      .where(
        '((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))',
        { id, myId },
      )
      .orderBy('dms.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1) + skip)
      .getMany();
  }

  async createWorkspaceDMChats(
    url: string,
    id: number,
    content: string,
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });

    const savedDm = await this.dmsRepository.save({
      senderId: myId,
      receiverId: id,
      content: content,
      workspaceId: workspace.id,
    });

    const dmWithSender = await this.dmsRepository.findOne({
      where: { id: savedDm.id },
      relations: ['sender'],
    });

    console.log('dmWithSender : ', dmWithSender);

    if (!onlineMap[`/ws-${workspace.url}`]) {
      return;
    }

    const receiverSocketId = getKeyByValue(
      onlineMap[`/ws-${workspace.url}`],
      id,
    );

    const senderSocketId = getKeyByValue(
      onlineMap[`/ws-${workspace.url}`],
      myId,
    );

    if (receiverSocketId) {
      const nsp = namespaceMap[`/ws-${url}`][receiverSocketId];
      nsp.emit('dm', dmWithSender);
    }

    if (senderSocketId) {
      const nsp = namespaceMap[`/ws-${url}`][senderSocketId];
      nsp.emit('dm', dmWithSender);
    }
  }

  async createWorkspaceDMImages(
    url: string,
    id: number,
    files: Express.Multer.File[],
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });

    for (let i = 0; i < files.length; i++) {
      const savedDm = await this.dmsRepository.save({
        senderId: myId,
        receiverId: id,
        content: files[i].path,
        workspaceId: workspace.id,
      });

      const dmWithSender = await this.dmsRepository.findOne({
        where: { id: savedDm.id },
        relations: ['sender'],
      });

      if (!onlineMap[`/ws-${workspace.url}`]) {
        return;
      }

      const receiverSocketId = getKeyByValue(
        onlineMap[`/ws-${workspace.url}`],
        id,
      );

      const senderSocketId = getKeyByValue(
        onlineMap[`/ws-${workspace.url}`],
        myId,
      );

      if (receiverSocketId) {
        const nsp = namespaceMap[`/ws-${url}`][receiverSocketId];
        nsp.emit('dm', dmWithSender);
      }

      if (senderSocketId) {
        const nsp = namespaceMap[`/ws-${url}`][senderSocketId];
        nsp.emit('dm', dmWithSender);
      }
    }
  }

  async getDMUnreadsCount(url, id, myId, after) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    return this.dmsRepository.count({
      where: {
        workspaceId: workspace.id,
        senderId: id,
        receiverId: myId,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }
}
