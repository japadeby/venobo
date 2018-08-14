import { createLazyChildRoute } from '../../utils';

import { MediaResolver } from './media.resolver';
import { MediaComponent } from './media.component';

export const MediaRouting = createLazyChildRoute(MediaComponent, {
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  resolve: {
    media: MediaResolver,
  },
});
