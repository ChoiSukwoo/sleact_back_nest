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
  ) {
    return this.dmsRepository
      .createQueryBuilder('dms')
      .innerJoinAndSelect('dms.sender', 'sender')
      .innerJoinAndSelect('dms.receiver', 'receiver')
      .innerJoin('dms.workspace', 'workspace')
      .where('workspace.url = :url', { url })
      .andWhere(
        '((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))',
        { id, myId },
      )
      .orderBy('dms.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceDMChats(
    url: string,
    content: string,
    id: number,
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const dm = new Dms();
    dm.senderId = myId;
    dm.receiverId = id;
    dm.content = content;
    dm.workspaceId = workspace.id;
    const savedDm = await this.dmsRepository.save(dm);
    const dmWithSender = await this.dmsRepository.findOne({
      where: { id: savedDm.id },
      relations: ['sender'],
    });
    console.log('dmWithSender : ', dmWithSender);
    if (onlineMap[`/ws-${workspace.url}`]) {
      const receiverSocketId = getKeyByValue(
        onlineMap[`/ws-${workspace.url}`],
        Number(id),
      );
      console.log('receiverSocketId : ', receiverSocketId);

      const nsp = namespaceMap[`/ws-${url}`][receiverSocketId];
      nsp.emit('dm', dmWithSender);
    }
  }

  async createWorkspaceDMImages(
    url: string,
    files: Express.Multer.File[],
    id: number,
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    for (let i = 0; i < files.length; i++) {
      const dm = new Dms();
      dm.senderId = myId;
      dm.receiverId = id;
      dm.content = files[i].path;
      dm.workspaceId = workspace.id;
      const savedDm = await this.dmsRepository.save(dm);
      const dmWithSender = await this.dmsRepository.findOne({
        where: { id: savedDm.id },
        relations: ['sender'],
      });
      if (onlineMap[`/ws-${workspace.url}`]) {
        const receiverSocketId = getKeyByValue(
          onlineMap[`/ws-${workspace.url}`],
          Number(id),
        );

        const nsp = namespaceMap[`/ws-${url}`][receiverSocketId];
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

  async testSocket(url: string, id: number) {
    console.log(`url : /ws-${url}`);
    if (onlineMap[`/ws-${url}`]) {
      const receiverSocketId = getKeyByValue(
        onlineMap[`/ws-${url}`],
        Number(id),
      );

      const nsp = namespaceMap[`/ws-${url}`][receiverSocketId];
      nsp.emit('temp', { message: '테스트' });
    }
  }
}
