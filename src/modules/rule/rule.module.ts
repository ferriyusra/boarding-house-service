import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { RepositoryModule } from 'src/repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [RuleController],
  providers: [RuleService],
})
// eslint-disable-next-line prettier/prettier
export class RuleModule { }
