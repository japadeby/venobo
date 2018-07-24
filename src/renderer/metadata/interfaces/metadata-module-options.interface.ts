import { MetadataConfig } from './metadata-config.interface';
import { MetadataProvider } from './metadata-provider.interface';

export interface MetadataModuleOptions {
  provider: MetadataProvider;
  config: MetadataConfig;
}
