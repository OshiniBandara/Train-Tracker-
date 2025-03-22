import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogModule} from '@angular/material/dialog';
import { MatDialog} from '@angular/material/dialog';
import { AddTrainRecordComponent } from '../TrainRecords/addrecord/addrecord.component';
import { EditTrainRecordComponent } from '../TrainRecords/edit-train-record/edit-train-record.component';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../services/api.service';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { DeleteTrainRecordComponent } from '../TrainRecords/delete-train-record/delete-train-record.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [    
    MatDialogModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule, // Add MatSortModule for MatSort directive
    MatPaginatorModule, 
    MatIconModule,// Add MatPaginatorModule for MatPaginator directive
  ],
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  displayedColumns: string[] = ['date', 'trainName', 'fromDestination', 'toDestination', 'scheduledTime', 'delayTime', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (private dialog: MatDialog, private api : ApiService){

  }
  ngOnInit(): void {
    this.getTrainRecords();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddTrainRecordComponent,{
      width: '450px', // Set the width of the dialog
      height: 'auto', // Set height
      
    })
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getTrainRecords();
    });
  }

  // Edit a train record
  editRecord(row : any){
    const dialogRef = this.dialog.open(EditTrainRecordComponent, {
      width: '450px', 
      height: 'auto',
      data: row
    });
  
    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        console.log('Record updated, refreshing data...');
        this.getTrainRecords(); 
      }
    });
  }

  // Delete Dialog box
  openDeleteDialog(recordId: string): void {
    const dialogRef = this.dialog.open(DeleteTrainRecordComponent, {
      data: { recordId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRecord(recordId);
      }
    });
  }

  // Get Train Records
  getTrainRecords() {
    this.api.getTrainRecord()
      .subscribe({
        next: (res) => {
          console.log('API Response:', res); 
          
          // Check if data exists and has records
          if (res && res.data) {
            const trainRecords = Object.values(res.data);
            if (trainRecords.length === 0) {
              console.log("No train records found.");
              this.dataSource = new MatTableDataSource<any>([]);  // Set empty data source
            } else {
              this.dataSource = new MatTableDataSource<any>(trainRecords);
            }
          } else {
            console.log("No data found in response.");
            this.dataSource = new MatTableDataSource<any>([]);
          }
  
          // Apply pagination and sorting
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.log("Error fetching train records:", err);
          // Handle API errors such as 404 or 500
          if (err.status === 404) {
            console.log("API endpoint not found:", err);
          } else {
            alert("Error while fetching the records!");
          }
          this.dataSource = new MatTableDataSource<any>([]);
        }
      });
  }
  

  // Delete a train record
  deleteRecord(id : string ){
    debugger;
    console.log("Deleting record with ID: ", id); 
    this.api.deleteTrainRecord(id)
    .subscribe({
      next:(res)=>{
        alert("Record Deleted Successfully!")
        this.getTrainRecords();
      },
      error:()=>{
        alert("Error While Deleting the Record!")
      }
    })
  }


  // Filter Data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      //this.getTrainRecords();
    }
  }
}
