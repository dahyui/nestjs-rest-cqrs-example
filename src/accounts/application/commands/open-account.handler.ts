import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { OpenAccountCommand } from 'src/accounts/application/commands/open-account.command';

import { Account } from 'src/accounts/domain/account';
import AccountRepository from 'src/accounts/domain/repository';

@CommandHandler(OpenAccountCommand)
export class OpenAccountHandler implements ICommandHandler<OpenAccountCommand> {
  constructor(
    @Inject('AccountRepositoryImplement')
    private readonly accountRepository: AccountRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: OpenAccountCommand): Promise<any> {
    const data = new Account({
      id: await this.accountRepository.newId(),
      name: command.name,
      password: command.password,
      balance: 0,
      openedAt: new Date(),
      updatedAt: new Date(),
    });

    const account = this.eventPublisher.mergeObjectContext(data);

    await this.accountRepository.save(account);

    account.commit();
  }
}
