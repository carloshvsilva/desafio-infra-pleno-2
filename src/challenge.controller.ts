import { Controller, Get } from '@nestjs/common';
import { ChallengeService } from './challenge.service';

@Controller()
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  tryConnection(): Promise<string> {
    return this.challengeService.tryConnection();
  }
}
