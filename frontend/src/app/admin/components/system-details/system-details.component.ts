import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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

      this.http.post(`${this.apiUrl}/update`, formData).subscribe(() => {
        alert('System logo updated successfully!');
        this.isEditingLogo = false;
        this.loadSystemInfo();
      });
    }
  }

  // Toggle about section edit mode
  toggleAboutEdit() {
    if (this.isEditingAbout) {
      this.updateSystemInfo();
    }
    this.isEditingAbout = !this.isEditingAbout;
  }

  // Add a new FAQ
  addFAQ() {
    if (this.newFaq.question && this.newFaq.answer) {
      this.faqs.push({ ...this.newFaq });
      this.newFaq = { question: '', answer: '' };
      this.showNewFaq = false;
      this.updateSystemInfo();
    }
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
    this.faqs.splice(index, 1);
    this.updateSystemInfo();
  }

  // Add a new contact
  addContact() {
    if (this.newContact.value.trim() !== '') {
      this.contacts.push({ value: this.newContact.value, isEditing: false });
      this.newContact.value = ''; // Clear input
      this.showNewContact = false; // Hide input after adding
      this.updateSystemInfo();
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
    this.contacts.splice(index, 1);
    this.updateSystemInfo();
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
      alert('System information updated successfully!');
    });
  }
  
}
