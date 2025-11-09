import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChartLine,
  faFilePrescription,
  faChartBar,
  faHome,
  faUser,
  faBars,
  faTimes,
  faChevronLeft,
  faSignOutAlt,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isMobile = false;
  isCollapsed = false;
  currentRoute = '';
  
  // FontAwesome Icons
  faChartLine = faChartLine;
  faFilePrescription = faFilePrescription;
  faChartBar = faChartBar;
  faHome = faHome;
  faSignOutAlt=faSignOutAlt;
  faUser = faUser;
  faBars = faBars;
  faTimes = faTimes;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // Simplified navigation based on requirements
  navItems = [
    { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: 'filePrescription' },
    { name: 'Reports', href: '/dashboard/reports', icon: 'chartBar' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      console.log('Current Route:', this.currentRoute);
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.checkScreenSize();
    this.currentRoute = this.router.url;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      if (this.isMobile) {
        this.isCollapsed = true;
      } else {
        this.isCollapsed = false;
      }
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  // Fixed active route detection
  isActiveRoute(href: string): boolean {
    if (href === '/dashboard') {
      // For dashboard home, match exactly or with trailing slash
      return this.currentRoute === '/dashboard' || this.currentRoute === '/dashboard/';
    } else {
      // For other routes, check if current route starts with the href
      return this.currentRoute.startsWith(href);
    }
  }

  getPageTitle(): string {
    if (this.currentRoute.includes('prescriptions') || this.currentRoute == '/dashboard') {
      return 'Prescription Management';
    } else if (this.currentRoute.includes('reports')) {
      return 'Reports & Analytics';
    } else {
      return 'Dashboard Overview';
    }
  }

  getPageSubtitle(): string {
    if (this.currentRoute.includes('prescriptions') || this.currentRoute == '/dashboard') {
      return 'Manage patient prescriptions efficiently';
    } else if (this.currentRoute.includes('reports')) {
      return 'View prescription reports and analytics';
    } else {
      return 'Welcome to CMED Health Dashboard';
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  onSidebarClick(event: Event) {
    event.stopPropagation();
  }

  // Helper method to get icon by name
  getIcon(iconName: string) {
    switch(iconName) {
      case 'chartLine': return this.faChartLine;
      case 'filePrescription': return this.faFilePrescription;
      case 'chartBar': return this.faChartBar;
      case 'home': return this.faHome;
      default: return this.faChartLine;
    }
  }

  // Navigate to home page
  navigateToHome() {
    this.router.navigate(['/']);
  }
}