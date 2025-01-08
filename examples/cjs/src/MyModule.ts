import type { IServiceCollection, IServiceModule } from '@shellicar/core-di';
import { MyOtherService } from './MyOtherService.js';
import { MyService } from './MyService.js';
import { IMyOtherService, IMyService } from './interfaces.js';

export class MyModule implements IServiceModule {
  registerServices(services: IServiceCollection): void {
    services.register(IMyService).to(MyService);
    services.register(IMyOtherService).to(MyOtherService);
  }
}
