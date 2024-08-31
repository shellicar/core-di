import type { IServiceCollection } from './interfaces';
import { ServiceCollection } from './ServiceCollection';

export const createServiceCollection = (): IServiceCollection => new ServiceCollection() as IServiceCollection;
