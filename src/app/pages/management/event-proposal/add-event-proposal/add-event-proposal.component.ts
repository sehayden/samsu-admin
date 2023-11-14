import { Component } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastRef, NbToastrService } from '@nebular/theme';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { EventProposalService } from '../../../../../services/event-propsal.service';
import { FILE_URL_SEPARATOR, FileUploadService } from '../../../../../services/file-upload.service';

@Component({
  selector: 'ngx-add-event-proposal',
  templateUrl: './add-event-proposal.component.html',
  styleUrls: ['./add-event-proposal.component.scss']
})
export class AddEventProposalComponent {
  selectedFileNames: string = 'Choose files';
  editorContent: string;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  selectedFiles: File[] = [];
  title: string;
  constructor(private uploadService: FileUploadService, private eventProposalService: EventProposalService, private toastrService: NbToastrService,
  ) { }
  onFileChange(event: any) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      // Add selected files to the array
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files as File[])];
      this.updateFileInputLabel();
    }
  }

  removeFile(index: number) {
    // Remove a file from the array
    this.selectedFiles.splice(index, 1);
    this.updateFileInputLabel();
  }

  getSelectedFileNames(): string {
    return this.selectedFiles.length > 0 ? this.selectedFiles.map(file => file.name).join(', ') : 'Choose files';
  }

  resetForm() {
    // Reset form fields and selected files
    this.title = '';
    this.editorContent = '';
    this.selectedFiles = [];
  }

  submitEventProposal() {
    // Show loading indicator
    const toastRef: NbToastRef = this.toastrService.show('Submitting event proposal...', 'Loading', {
      duration: 0,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      status: 'info',
    });

    // Upload files first and then submit the event proposal
    this.uploadFiles().pipe(
      switchMap(fileUrls => {
        // Build the proposal body
        const files = fileUrls.join(FILE_URL_SEPARATOR);
        const proposalBody = {
          title: this.title,
          content: this.editorContent,
          fileUrls: files,
        };

        // Submit the event proposal
        return this.eventProposalService.postEventProposal(proposalBody);
      }),
      catchError(error => {
        // Handle error and show toastr
        toastRef.close();
        this.toastrService.show('Failed to submit event proposal', 'Error', {
          duration: 3000,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          status: 'danger',
        });

        return throwError(error);
      }),
    ).subscribe(() => {
      // Hide loading indicator on success
      toastRef.close();

      // Show success toastr
      this.toastrService.show('Event proposal submitted successfully!', 'Success', {
        duration: 5000,
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        status: 'success',
      });

      // Reset the form or navigate to another page as needed
      this.resetForm();
    });
  }
  updateFileInputLabel() {
    // Update the label text with the names of the selected files
    const label = document.querySelector('.custom-file-label');
    if (label) {
      label.textContent = this.getSelectedFileNames();
    }
  }

  uploadFiles(): Observable<string[]> {
    // Use the FileUploadService to upload files
    // Assuming the FileUploadService returns an observable with the file URLs
    return this.uploadService.uploadFiles(this.selectedFiles);
  }
}
