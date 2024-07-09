import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss'],
})
export class UpdateCourseComponent implements OnInit {
  courseUpdateForm: FormGroup;
  arrCourses: Course[] = [];
  idUpdated: string = '';

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.courseUpdateForm = this.fb.group({
      id: ['', Validators.required],
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.arrCourses = courses;
      console.log('Courses Loaded:', this.arrCourses);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.courseUpdateForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const updatedCourse: Course = {
      id: frmValue.id,
      courseName: frmValue.courseName,
      courseDescription: frmValue.courseDescription,
      categoryId: frmValue.categoryId
    };

    this.courseService.updateCourse(updatedCourse).subscribe(
      (response: Course[]) => {
        console.log('Course updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating course', error);
      }
    );
  }

  onChangeType(evt: any): void {
    const selectedCourseId = evt.target.value.split(':')[1].trim();
    console.log('Selected Course ID:', selectedCourseId);
  
    const selectedCourse = this.arrCourses.find(course => course.id === selectedCourseId);
    console.log('Selected Course:', selectedCourse);
  
    if (selectedCourse) {
      this.courseUpdateForm.patchValue({
        id: selectedCourse.id,
        courseName: selectedCourse.courseName,
        courseDescription: selectedCourse.courseDescription,
        categoryId: selectedCourse.categoryId
      });
      console.log('Form Updated:', this.courseUpdateForm.value);
    }
  }
  
}
