import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalCount: number = 0;
  @Input() limit: number = 10;
  @Input() currentPage: number = 1;

  @Output() changePage = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.limit);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.changePage.emit(page);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

}
