
import { Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ComidasComponent } from './pages/comidas/comidas.component';
import { BebidasComponent } from './pages/bebidas/bebidas.component';
import { JuegoComponent } from './pages/juego/juego.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'comidas', component: ComidasComponent },
  { path: 'bebidas', component: BebidasComponent },
  { path: 'juego', component: JuegoComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: '**', redirectTo: '' }
];
