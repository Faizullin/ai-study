import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { DocumentFileModel } from "app/core/models/document";

@Component({
  selector: "dashboard-file-list",
  templateUrl: "./file-list.component.html",
  styleUrls: ["./file-list.component.scss"],
})
export class FileListComponent {
  @Input() files: DocumentFileModel[] = [];
  @Input() max_files_count: number = 7;
  @Input() loading: boolean = false;
  @Output() onFileDelete: EventEmitter<number> = new EventEmitter<number>();
  @Output() onFileUpload: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("fileInput") fileInput: ElementRef;

  public onFileUploadClick() {
    this.fileInput.nativeElement.click();
  }
  public onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.onFileUpload.emit(file);
    }
  }
  public onFileDeleteClick(event: any, item: DocumentFileModel) {
    event?.preventDefault();
    this.onFileDelete.emit(item.id);
  }
  public getFileIconUrl(file: DocumentFileModel): string {
    const fileExtension = file.extension;
    const iconMappings: { [key: string]: string } = {
      ".pdf":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/pdf.svg",
      ".jpg":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/jpg.svg",
      ".png":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/png.svg",
      ".jpeg":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/jpg.svg",
      ".mp4":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/avi.svg",
      ".txt":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/txt.svg",
      ".docx":
        "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/doc.svg",
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAS1BMVEWQyvn///8ZdtLh9f6LyPnL5fwQc9GVzvtZneMug9iKxvcKcdBzs+53te7E5fzl9/72+/4getRIkd6s2fqw2/tqq+ozhtlbn+R8uvENnIi4AAACXElEQVR4nO3c3U7CQBRF4YqlxaLiv77/k2rCBZCQQDtnOHuPa12TwJdDmANt6O5ar8t+AdVD6B9C/xD6h9A/hP4h9O864brvbtH40rqw6yoQxYQViGrCeKKcMJyoJ4wmCgqDiSrC8f3oKUKJMsJdLaKM8L4WUUdYiygkrERUEtYhSgmrELWENYhiwgpENWE8UU4YTtQTnhADvvULCoOnqCiMJUoKQ4mawkiiqDCQqCqMI8oKww4NXWHUFIWFQVNUFsZMUVoYQtQWRhDFhQFEdWE5UV5YTNQXlh4aBsLCKToIy6ZoIfwjToeHziR6CEveqCbCgim6CJdP0Ua4eIo+wqVTNBKeTPH6Q8NJuGyKVsJFR7+XcMnHjZnweIrTuknh0RT7RoWHKboJd9cTP3pHYfc8o9FS2M+osxTODyFChPkhRIgwP4QIEeaHECHC/BAiRJgfQoQI80OIEGF+CCsIx9gEhZvYPvWEQ2jbtwtTTBCuQhsQIkSI8F8Kh6F14UNsGz1h8NZ2aW1j80aIMD+ECBGeqebhpyEsWWC+LIQFe+nwaiEs2bMRIkSIEOG+kl+4VxbCkosU3xbC9re2G4cQIcL8ECJcIJyC0xNG3aOwjzsVECJEiBChp3Abm6DwMbafC0/HXooQYX4IESLML0H4VJKFsGRF87j2VLJne1w/RIgQIUKE5cL2z8Npzv/Inv9fWXHhjUOIEGF+CBEizA8hQoT5IUSIMD+ECBHmhxAhwvwQIkSYH0KECPNDiBBhfggRIswPIUKE+SGcJXQOoX8I/UPoH0L/EPqH0L/2hb8FyrbF3z/N8wAAAABJRU5ErkJggg==",
    };

    return iconMappings[fileExtension] || iconMappings["default"];
  }
  public getFileSize(file: DocumentFileModel) {
    return (file.size / Math.pow(1024, 1)).toFixed(0);
  }
}
