import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BaseDeleteDialogComponent } from "../base-delete/base-delete-dialog/base-delete-dialog.component";
import { LoadingState } from "app/core/models/loading-state";
import { BaseHttpService } from "app/core/services/base-http.service";
import { debounceTime, filter } from "rxjs";
import { FormControl } from "@angular/forms";
import { IFilterParams } from "../../filter-select/filter-select.component";

export interface ITableColumn<T> {
  header: string;
  field: string;
  sortable?: boolean;
  filter?: IFilterParams;
  render?: (item: T) => string;
}
interface ITableItemAction<T> {
  onClick?: (item: T) => any;
  use: boolean;
  url?: (id?: number) => string;
  component?: any;
}
export interface ITablesActionData<T> {
  [key: "edit" | "create" | "delete" | "list" | string]: ITableItemAction<T>;
}
export interface IFilterRequestParams {
  ordering: string;
  filters: { [key: string]: any };
}
export interface IPaginationData {
  pageSize: number;
  pageSizeOptions: number[];
  page: number;
  totalPages: number;
}
@Component({
  selector: "dashboard-base-list",
  templateUrl: "./base-list.component.html",
  styleUrls: ["./base-list.component.scss"],
})
export class BaseListComponent<T> implements OnInit, OnChanges {
  constructor(
    protected baseHttpService: BaseHttpService,
    private dialog: MatDialog
  ) {}
  @Input() title!: string;
  @Input() description: string;
  @Input() columns: ITableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() actions: ITablesActionData<T> = {};
  @Input() output_actions: ITablesActionData<T> = {};
  @Input() loading: LoadingState = {
    list: false,
    post: false,
  };
  @Input() filterParams: IFilterRequestParams = {
    ordering: "-id",
    filters: {},
  };
  @Input() triggerListRequest: boolean = false;
  public filterControls: { [key: string]: FormControl } = {};
  protected pagination: IPaginationData = {
    page: 0,
    pageSize: 10,
    totalPages: 0,
    pageSizeOptions: [1, 10, 25, 50, 100],
  };

  ngOnInit(): void {
    const newFilterControls = {};
    this.columns.forEach((column) => {
      if (column.filter) {
        newFilterControls[column.field] = new FormControl();
        if (column.filter.type === "text") {
          newFilterControls[column.field].valueChanges
            .pipe(debounceTime(500))
            .subscribe((value: string) => {
              this.filterParams.filters[column.field] = value;
              this.pagination.page = 0;
              this.fetchData();
            });
        } else if (column.filter.type === "select") {
          newFilterControls[column.field].valueChanges
            .pipe(debounceTime(300))
            .subscribe((value: any) => {
              this.filterParams.filters[column.field] = value;
              this.pagination.page = 0;
              this.fetchData();
            });
        }
      }
    });
    this.filterControls = newFilterControls;
    this.fetchData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.triggerListRequest && !changes.triggerListRequest.firstChange) {
      this.fetchData();
    }
  }
  protected fetchDataRequest(filters?: any) {
    if (this.actions.list.onClick !== undefined) {
      return this.actions.list.onClick(filters);
    } else {
      return this.baseHttpService.get(this.actions.list.url(), {
        ...filters,
      });
    }
  }
  protected getFilters(data: any) {
    const apply_filters = {
      ...this.filterParams,
      ...this.filterParams.filters,
      page_size: this.pagination.pageSize,
      page: this.pagination.page + 1,
      ...data,
    };
    delete apply_filters.filters;
    return apply_filters;
  }
  protected fetchData(data?: any) {
    this.loading.list = true;
    this.fetchDataRequest(this.getFilters(data)).subscribe({
      next: (data) => {
        this.data = data.results;
        this.pagination.totalPages = data.count;
        this.loading.list = false;
      },
      error: () => {
        this.loading.list = false;
      },
    });
  }
  public onEdit(item: T) {
    if (this.actions?.edit?.onClick !== undefined) {
      this.executeFunction("edit", item);
    } else if (this.actions?.edit?.component !== undefined) {
      const dialogRef = this.dialog.open(this.actions?.edit?.component, {
        data: item,
        width: "1000px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.fetchData();
        }
      });
    }
  }
  public onDelete(item: T) {
    if (this.actions?.delete?.onClick !== undefined) {
      this.executeFunction("delete", item);
    } else {
      const dialogRef = this.dialog.open(BaseDeleteDialogComponent, {
        data: item,
        width: "640px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && this.actions.delete.url !== undefined) {
          this.loading.post = true;
          this.baseHttpService
            .delete(this.actions.delete.url((item as any).id))
            .subscribe({
              next: (response) => {
                this.loading.post = false;
                this.fetchData();
              },
              error: (error) => {
                this.loading.post = false;
                if (error.status === 404) {
                  alert("Not found");
                }
              },
            });
        }
      });
    }
  }
  public onPageChanged(page_data: any) {
    this.pagination.page = page_data.pageIndex;
    this.pagination.pageSize = page_data.pageSize || 10;
    this.fetchData();
  }
  public onSortChanged(item: ITableColumn<T>) {
    if (item.sortable) {
      const sortKey = item.field;
      if (sortKey.startsWith("-")) {
        const tmp_sortKey = sortKey.slice(1);
        if (tmp_sortKey === this.filterParams.ordering) {
          this.filterParams.ordering = tmp_sortKey;
        }
      } else {
        if (sortKey === this.filterParams.ordering) {
          this.filterParams.ordering = "-" + this.filterParams.ordering;
        } else {
          this.filterParams.ordering = sortKey;
        }
      }
      this.fetchData();
    }
  }
  get filters_count(): number {
    const filter_defined = this.columns.map(
      (item) => item.filter !== undefined
    );
    return filter_defined.filter((item) => item === true).length;
  }
  private executeFunction(field_name: string, item: T): any {
    const func = this.actions[field_name].onClick;
    if (func) {
      return func(item);
    }
    return null;
  }
}
