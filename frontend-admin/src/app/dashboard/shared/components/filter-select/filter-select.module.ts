import { NgModule } from "@angular/core";
import { AsyncPipe, CommonModule } from "@angular/common";
import { FilterSelectComponent } from "./filter-select.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@NgModule({
  declarations: [FilterSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatGridListModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    // MatChipsModule, MatIconModule, MatGridListModule
  ],
  exports: [FilterSelectComponent],
})
export class FilterSelectModule {}
