import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit {

  courseAddForm: FormGroup;
  courses: Course[] = [];

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.courseAddForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.courses = courses;
      console.log('Courses Loaded:', this.courses);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.courseAddForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  getMaxId(courses: Course[]): number {
    return courses.reduce((max, course) => (parseInt(course.id) > max ? parseInt(course.id) : max), 0);
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const newCourseId = this.getMaxId(this.courses) + 1;

    const newCourse: Course = {
      id: newCourseId.toString(), 
      courseName: frmValue.courseName,
      courseDescription: frmValue.courseDescription,
      categoryId: frmValue.categoryId
    };

    this.courseService.addCourse(newCourse).subscribe(
      (response: Course[]) => {
        console.log('Course added successfully', response);
        this.loadCourses(); // Reload courses to update the list
      },
      (error: any) => {
        console.error('Error adding course', error);
      }
    );
  }
}
