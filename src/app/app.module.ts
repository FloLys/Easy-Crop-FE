import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { MapComponent } from "./components/map/map.component";
import { DrawerComponent } from "./components/menu/drawer/drawer.component";
import { EditCalendarComponent } from "./components/menu/edit-calendar/edit-calendar.component";
import { IconexLightPlusComponent } from "./components/menu/iconex-light-plus/iconex-light-plus.component";
import { IconexLightMinusComponent } from "./components/menu/iconex-light-minus/iconex-light-minus.component";
import { IconsArrowDropDown24PxComponent } from "./components/menu/icons-arrow-drop-down-24-px/icons-arrow-drop-down-24-px.component";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DrawerComponent,
    EditCalendarComponent,
    IconexLightPlusComponent,
    IconexLightMinusComponent,
    IconsArrowDropDown24PxComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
