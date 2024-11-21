import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DiagramAllModule, SymbolPaletteAllModule ,SnappingService, DiagramModule, SymbolPaletteModule} from '@syncfusion/ej2-angular-diagrams';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,DiagramModule,SymbolPaletteModule
  ],
  providers: [SnappingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
