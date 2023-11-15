import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceapiService } from 'src/app/services/serviceapi.service';	

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  displayColumns: string[] = ['position', 'image', 'name'];
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  simpson = [];
  paginatorPageSizeOptions: number[] = [];
  originalData: any[] = []; 
  savedItems: any[] = [];

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private serviceapi: ServiceapiService) {
    this.originalData = [];
  }
  ngOnInit(): void {
    this.getPersonajes(); 
    this.savedItems = this.getSavedItems();
  }

  getPersonajes() {
    this.serviceapi.getPersonajes().subscribe((res: any) => {
      const simpsondata = res.docs.map((item: any, index: number) => ({
        position: index + 1,
        image: item.Imagen,
        name: item.Nombre,
      }));
  
      this.data = simpsondata;
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  getPersonajesPage(page: number, limit: number): void {
    this.serviceapi.getPersonajesPage(page, limit).subscribe((res: any) => {
      const simpsondata = res.docs.map((item: any, index: number) => ({
        position: index + 1,
        image: item.Imagen,
        name: item.Nombre,
        
      }));
      
      this.originalData = [...simpsondata];
      const totalPages = res.totalPages;
      const pageSizeOptions = Array.from({ length: totalPages }, (_, i) => (i + 1) * limit);

      this.data = simpsondata;
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  
  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement)?.value?.trim().toLowerCase();

    if (filterValue !== undefined) {
      this.data = this.originalData.filter((element: any) => {
        return element.name.toLowerCase().includes(filterValue);
      });

      this.dataSource = new MatTableDataSource<any>(this.data);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }
  getSavedItems(): any[] {
    const savedItemsString = localStorage.getItem('savedItems');

    if (savedItemsString) {
      return JSON.parse(savedItemsString) || [];
    } else {
      return [];
    }
  }

  toggleSave(element: any): void {
    const isAlreadySaved = this.savedItems.some((savedItem: any) => savedItem.id === element.id);

    if (!isAlreadySaved) {
      this.savedItems.push({
        id: element.id,
        name: element.name,
      });
    } else {
      this.savedItems = this.savedItems.filter((savedItem: any) => savedItem.id !== element.id);
    }

    this.saveToLocalStorage();

    this.data.forEach(item => item.isSaved = this.isSaved(item));
  }

  isSaved(element: any): boolean {
    return this.savedItems.some((savedItem: any) => savedItem.id === element.id);
  }

  saveToLocalStorage(): void {
    localStorage.setItem('savedItems', JSON.stringify(this.savedItems));
  }


}
