import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  student = {
    name: '',
    enrollmentNo: '',
    stream: '',
  };

  students: any[] = [];

  onSubmit() {
    this.students.push({ ...this.student });
    this.student = { name: '', enrollmentNo: '', stream: '' };
  }
}
