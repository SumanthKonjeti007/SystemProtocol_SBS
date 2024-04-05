import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../capitalize.pipe';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { UserRoles } from '../../user-roles';

@Component({
  selector: 'app-transaction-action',
  templateUrl: './transaction-action.component.html',
  styleUrls: ['./transaction-action.component.css']
})
export class TransactionActionComponent implements OnInit {
  action: string | null = null;
  id: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router,private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    if (this.jwtHelper.checkSessionValidity(UserRoles.customer)){
    this.action = this.route.snapshot.paramMap.get('action');
    this.id = this.route.snapshot.paramMap.get('id');
  }
  }

  performAction(): void {
    // Placeholder for actual action
    console.log(`${this.action} on transaction ID: ${this.id}`);
    this.router.navigate(['/transactions']);
  }
}
