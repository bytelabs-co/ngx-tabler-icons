import { Component } from '@angular/core';
import { IconAerialLiftFilledComponent, IconMoonComponent } from '@bytelabs/ngx-tabler-icons';

@Component({
  selector: 'app-root',
  imports: [
    IconMoonComponent,
    IconAerialLiftFilledComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';
}