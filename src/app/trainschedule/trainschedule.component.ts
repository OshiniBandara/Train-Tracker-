// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-trainschedule',
//   imports: [],
//   templateUrl: './trainschedule.component.html',
//   styleUrl: './trainschedule.component.scss'
// })
// export class TrainscheduleComponent {

// }

// trainschedule.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ApiService } from '../services/api.service'; 
import { AddTrainRecordComponent } from '../addrecord/addrecord.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-trainschedule',
  standalone: true,
  imports: [   
    AddTrainRecordComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule, // Add MatSortModule for MatSort directive
    MatPaginatorModule, 
    // Add MatPaginatorModule for MatPaginator directive
  ],
  templateUrl: './trainschedule.component.html',
  styleUrls: ['./trainschedule.component.scss']
})
export class TrainscheduleComponent implements OnInit {
  // Columns to display in the table
  displayedColumns: string[] = ['date', 'trainName', 'fromDestination', 'toDestination', 'scheduledTime'];

  // Table data source
  dataSource!: MatTableDataSource<any>;

  // Paginator and sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Fetch train schedule data on component initialization
    this.getTrainSchedules();
  }

  // Fetch train schedules from the API
  getTrainSchedules() {
    this.api.getTrainSchedules()
    // .subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     const trainSchedules = Object.values(res.data); // Convert object to array
    //     this.dataSource = new MatTableDataSource(trainSchedules); // Initialize dataSource
    //     this.dataSource.paginator = this.paginator; // Set paginator
    //     this.dataSource.sort = this.sort; // Set sort
    //   },
    //   error: (err: any) => {
    //     alert('Error while fetching train schedules!');
    //   }
    //});
  }

  // Apply filter to the table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}