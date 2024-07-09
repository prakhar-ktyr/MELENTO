import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {

  categoryAddForm: FormGroup;
  categories: Category[] = [];

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryAddForm = this.fb.group({
      category: ['', Validators.required],
      categoryDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      console.log('Categories Loaded:', this.categories);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.categoryAddForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  getMaxId(categories: Category[]): number {
    return categories.reduce((max, category) => (parseInt(category.id) > max ? parseInt(category.id) : max), 0);
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const newCategoryId = this.getMaxId(this.categories) + 1;

    const newCategory: Category = {
      id: newCategoryId.toString(),
      category: frmValue.category,
      categoryDescription: frmValue.categoryDescription
    };

    this.categoryService.addCategory(newCategory).subscribe(
      (response: Category[]) => {
        console.log('Category added successfully', response);
        this.loadCategories(); // Reload categories to update the list
      },
      (error: any) => {
        console.error('Error adding category', error);
      }
    );
  }
}
