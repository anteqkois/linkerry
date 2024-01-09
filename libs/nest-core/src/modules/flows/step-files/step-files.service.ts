import { Injectable } from '@nestjs/common';

@Injectable()
export class StepFilesService {
  delete({ flowId, stepName }: { flowId: string, stepName: string }) {
    return 'This action delete all files';
  }
}
