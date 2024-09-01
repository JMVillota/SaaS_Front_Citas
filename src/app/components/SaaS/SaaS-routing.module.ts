import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'empresas', loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule) },
    ])],
    exports: [RouterModule]
})
export class SaaSRoutingModule { }
