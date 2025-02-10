import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-system-details',
  templateUrl: './system-details.component.html',
  styleUrls: ['./system-details.component.css']
})
export class SystemDetailsComponent implements OnInit {
  logoUrl: string = 'assets/img/logo.png';
  aboutText: string = '';
  faqs: any[] = [];
  contacts: { value: string, isEditing: boolean }[] = []; // Contact array with editing status

  newFaq = { question: '', answer: '' };
  isEditingLogo = false;
  isEditingAbout = false;
  showNewFaq = false;
  isEditingContacts = false;
  showNewContact = false;
  newContact = { value: '' }; // Temporary storage for new contact

  private apiUrl = 'http://localhost:8000/api/system-info'; // Laravel API URL

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadSystemInfo();
  }

  // Load system information from backend
  loadSystemInfo() {
    this.http.get<any>(this.apiUrl).subscribe((data) => {
      this.logoUrl = data.logo ?? 'assets/default-logo.png'; // Fallback for null logo
      this.aboutText = data.about_text ?? '';
      this.faqs = data.faqs ?? [];

      // Ensure contacts is always an array and formatted correctly
      this.contacts = Array.isArray(data.contacts)
        ? data.contacts.map((contact: any) => ({ value: contact, isEditing: false }))
        : [];
    }, error => {
      console.error('Error loading system info:', error);
      this.contacts = []; // Ensure contacts is always an array even if API fails
    });
  }

  // Toggle logo edit mode
  toggleLogoEdit() {
    this.isEditingLogo = !this.isEditingLogo;
  }

  // Handle logo upload
  onLogoChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('logo', file);

      this.http.post(`${this.apiUrl}/update`, formData).subscribe({
        next: () => {
          Swal.fire({
            title: "Logo Updated!",
            text: "The system logo has been successfully updated.",
            icon: "success",
            confirmButtonColor: "#428eba",
          });

          this.isEditingLogo = false;
          this.loadSystemInfo();
        },
        error: () => {
          Swal.fire({
            title: "Update Failed!",
            text: "There was an error updating the logo. Please try again.",
            icon: "error",
            confirmButtonColor: "#e74c3c",
          });
        }
      });
    }
  }


  // Toggle About Section Edit Mode with Swal Confirmation
  toggleAboutEdit() {
    if (this.isEditingAbout) {
      Swal.fire({
        title: "Save Changes?",
        text: "Do you want to save the updates to the About section?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#428eba", // Blue for confirmation
        cancelButtonColor: "#d33", // Red for cancel
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateSystemInfo();
          this.isEditingAbout = false;
          Swal.fire({
            title: "Updated!",
            text: "The About section has been successfully updated.",
            icon: "success",
            confirmButtonColor: "#428eba",
          });
        }
      });
    } else {
      this.isEditingAbout = true;
    }
  }

  // Add a new FAQ
  addFAQ() {
    if (!this.newFaq.question.trim() || !this.newFaq.answer.trim()) {
      // Show warning if question or answer is empty
      Swal.fire({
        title: "Warning!",
        text: "Both Question and Answer fields are required.",
        icon: "warning",
        confirmButtonColor: "#f39c12", // Yellow warning color
      });
      return;
    }

    this.faqs.push({ ...this.newFaq });
    this.newFaq = { question: '', answer: '' }; // Clear input fields
    this.showNewFaq = false;
    this.updateSystemInfo();

    // Show success message after adding
    Swal.fire({
      title: "FAQ Added!",
      text: "The new FAQ has been successfully added.",
      icon: "success",
      confirmButtonColor: "#428eba",
    });
  }


  // Edit an existing FAQ
  editFAQ(index: number) {
    this.faqs[index].isEditing = !this.faqs[index].isEditing;
    if (!this.faqs[index].isEditing) {
      this.updateSystemInfo();
    }
  }

  // Delete an FAQ
  deleteFAQ(index: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "This FAQ will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",  // Red color for Delete
      cancelButtonColor: "#428eba",  // Blue color for Cancel
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.faqs.splice(index, 1);
        this.updateSystemInfo();

        // Show success message after deletion
        Swal.fire({
          title: "Deleted!",
          text: "The FAQ has been successfully deleted.",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
      }
    });
  }


  // Add a new contact
  addContact() {
    if (this.newContact.value.trim() !== '') {
      this.contacts.push({ value: this.newContact.value, isEditing: false });
      this.newContact.value = ''; // Clear input
      this.showNewContact = false; // Hide input after adding
      this.updateSystemInfo();

      // Show success message after adding
      Swal.fire({
        title: "Contact Added!",
        text: "The new contact has been successfully added.",
        icon: "success",
        confirmButtonColor: "#428eba",
      });
    } else {
      // Show warning if input is empty
      Swal.fire({
        title: "Warning!",
        text: "Please enter a valid contact before adding.",
        icon: "warning",
        confirmButtonColor: "#f39c12",
      });
    }
  }


  // Edit an existing contact
  editContact(index: number) {
    if (this.contacts[index].isEditing) {
      this.updateSystemInfo();
    }
    this.contacts[index].isEditing = !this.contacts[index].isEditing;
  }

  // Delete a contact
  deleteContact(index: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "This contact will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",  // Red color for Delete
      cancelButtonColor: "#428eba",  // Blue color for Cancel
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.contacts.splice(index, 1);
        this.updateSystemInfo();

        // Show success message after deletion
        Swal.fire({
          title: "Deleted!",
          text: "The contact has been successfully deleted.",
          icon: "success",
          confirmButtonColor: "#428eba",
        });
      }
    });
  }

  // Toggle edit mode for contacts
  toggleEditContacts() {
    if (this.isEditingContacts) {
      this.updateSystemInfo();
    }
    this.isEditingContacts = !this.isEditingContacts;
  }

  // Update system information (about, FAQs, contacts)
  updateSystemInfo() {
    const updatedData = {
      about_text: this.aboutText,
      faqs: this.faqs,
      contacts: this.contacts.map(c => c.value) // Convert contact objects back to an array of strings
    };

    this.http.post(`${this.apiUrl}/update`, updatedData).subscribe(() => {
    });
  }

}
