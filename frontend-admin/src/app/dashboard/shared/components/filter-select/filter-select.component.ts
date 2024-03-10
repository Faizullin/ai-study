import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { debounceTime } from "rxjs";

interface IFilterDataItem {
  label: string;
  value: string;
}

export interface IFilterParams {
  type: "select" | "text";
  fetch?: {
    action?: Function;
    useInitital?: boolean;
    searchable?: boolean;
    data?: IFilterDataItem[];
    value_field?: string;
    label_field?: string;
  };
  defaultValue?: string[];
}

@Component({
  selector: "dashboard-filter-select",
  templateUrl: "./filter-select.component.html",
  styleUrls: ["./filter-select.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterSelectComponent),
      multi: true,
    },
  ],
})
export class FilterSelectComponent implements OnInit {
  constructor() {}
  @Input() filters_data!: IFilterParams;
  @Input() label!: string;
  @Input() removable: boolean = true;
  @Input() multiselect: boolean = true;
  @Input() searchable: boolean = true;

  public value_field: string = "value";
  public label_field: string = "label";
  public data: IFilterDataItem[] = [];
  public filteredData: IFilterDataItem[] = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public dataCtrl = new FormControl("");

  @ViewChild("searchDataInput") searchDataInput: ElementRef<HTMLInputElement>;

  remove(item: IFilterDataItem): void {
    const index = this.data.findIndex(
      (data_item) => data_item[this.value_field] === item[this.value_field]
    );
    if (index >= 0) {
      this.data.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const new_value = event.option.value;
    let prev_array = [...this.data];
    const found_value = prev_array.find(
      (item) => item[this.value_field] === new_value[this.value_field]
    );
    if (!found_value) {
      if (this.multiselect) {
        prev_array.push(new_value);
      } else {
        prev_array = [new_value];
      }
    }
    this.data = prev_array;
    this.onChange(this.data);
  }
  get showFilteredData() {
    const data_value_field_list =
      this.data.map((item) => item[this.value_field]) || [];
    return this.filteredData.filter(
      (item) => !data_value_field_list.includes(item[this.value_field])
    );
  }

  ngOnInit(): void {
    if (this.filters_data?.type === "select") {
      if (this.filters_data.fetch?.value_field) {
        this.value_field = this.filters_data.fetch.value_field;
      }
      if (this.filters_data.fetch?.label_field) {
        this.label_field = this.filters_data.fetch.label_field;
      }
      if (this.filters_data.fetch?.searchable) {
        if (this.filters_data.fetch?.action) {
          this.dataCtrl.valueChanges
            .pipe(debounceTime(300))
            .subscribe((search) => {
              if (search !== null) {
                this.fetchData({
                  [this.label_field]: search,
                  page_size: 4,
                  page: 1,
                });
              }
            });
        } else {
          throw new Error("Please proveide action in fetch if searchable");
        }
      }
      if (this.filters_data.fetch?.useInitital) {
        this.fetchData();
      }
      if (this.filters_data.fetch?.data) {
        this.filteredData = this.filters_data.fetch?.data;
      }
    }
  }
  private fetchData(filters?: any) {
    if (this.filters_data.fetch?.action !== undefined) {
      this.filters_data.fetch.action(filters).subscribe({
        next: (new_filter_array_value: IFilterDataItem[]) => {
          this.filteredData = new_filter_array_value;
        },
      });
    } else {
      throw new Error("Please proveide action in fetch if searchable");
    }
  }
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(newValue: any[]): void {
    if (newValue) {
      this.data = newValue;
      if (this.searchDataInput) {
        this.searchDataInput.nativeElement.value = "";
        this.dataCtrl.setValue(null);
      }
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
