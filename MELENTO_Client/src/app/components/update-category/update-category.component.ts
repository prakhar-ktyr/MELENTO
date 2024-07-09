import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
})
export class UpdateCategoryComponent implements OnInit {
  categoryUpdateForm: FormGroup;
  arrCategories: Category[] = [];
  idUpdated: string = '';

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryUpdateForm = this.fb.group({
      id: ['', Validators.required],
      category: ['', Validators.required],
      categoryDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.arrCategories = categories;
      console.log('Categories Loaded:', this.arrCategories);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.categoryUpdateForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  onChangeType(evt: any): void {
    const selectedCategoryId = evt.target.value.split(':')[1].trim();
    console.log('Selected Category ID:', selectedCategoryId);

    const selectedCategory = this.arrCategories.find(category => category.id === selectedCategoryId);
    console.log('Selected Category:', selectedCategory);

    if (selectedCategory) {
      this.categoryUpdateForm.patchValue({
        id: selectedCategory.id,
        category: selectedCategory.category,
        categoryDescription: selectedCategory.categoryDescription
      });
      console.log('Form Updated:', this.categoryUpdateForm.value);
    }
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const updatedCategory: Category = {
      id: frmValue.id,
      category: frmValue.category,
      categoryDescription: frmValue.categoryDescription
    };

    this.categoryService.updateCategory(updatedCategory).subscribe(
      (response: any) => {
        console.log('Category updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating category', error);
      }
    );
  }
}
