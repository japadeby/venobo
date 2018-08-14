import { ModuleWithProviders, Type } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

export function createLazyChildRoute(
  component: Type<any>,
  options: Route = {},
): ModuleWithProviders {
  const routes: Routes = [{
    path: '',
    component,
    ...options,
  }];

  return RouterModule.forChild(routes);
}
