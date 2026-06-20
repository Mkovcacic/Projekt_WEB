import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-nav',
  imports: [NgbCollapseModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  isMenuCollapsed = false;
}
