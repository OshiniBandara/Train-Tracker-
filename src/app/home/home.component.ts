import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';
import { AddTrainRecordComponent } from '../addrecord/addrecord.component';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [    MatDialogModule,
    CommonModule,
    AddTrainRecordComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
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
      width: '800px', // Set the width of the dialog
      height: '700px', // Set height
      
    })
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getTrainRecords();
    });
  }

  getTrainRecords(){
    this.api.getTrainRecord()
    .subscribe({
      next:(res)=>{
        console.log(res);
        this.dataSource = new MatTableDataSource(res); // Initialize dataSource
        this.dataSource.paginator = this.paginator; // Set paginator
        this.dataSource.sort = this.sort; // Set sort
      },
      error:(err)=>{
        alert("Error While Fetching the Records!");
      }
    })
  }

  editRecord(row : any){
    this.dialog.open(AddTrainRecordComponent,{
      width: '800px', // Set the width of the dialog
      height: '700px', // Set height
      data: row
    })
  }

  deleteRecord(id : number ){
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
