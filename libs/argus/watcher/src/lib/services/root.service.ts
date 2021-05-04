import { Injectable, LoggerService } from '@nestjs/common'
import { HostService } from './host.service'

@Injectable()
export class RootService {
  constructor(private host: HostService, private logger: LoggerService) {}

  assertRoot
}
