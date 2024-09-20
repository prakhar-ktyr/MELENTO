import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { AssessmentService } from "../../services/assessment.service";
import { Assessment } from "../../models/assessment";
import { Question } from "../../models/questions";
import { LocalStorageService } from "../../services/local-storage.service";
import { FileUploadService } from "../../services/file-upload.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-create-assessment",
  templateUrl: "./create-assessment.component.html",
  styleUrls: ["./create-assessment.component.scss"],
})
export class CreateAssessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  questionsForm: FormGroup;
  assessments: Assessment[] = [];
  loggedUserId: string = "";
  selectedFile: File | null = null;
  fileError: boolean = false;
  constructor(
    private fileUploadService: FileUploadService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private assessmentService: AssessmentService,
    private toastr : ToastrService
  ) {
    this.assessmentForm = this.fb.group({
      assessmentName: ["", Validators.required],
      assessmentDescription: ["", Validators.required],
      assessmentImage: ["", Validators.required],
      price: ["", Validators.required],
      time: ["", Validators.required], // Time is treated as a string
    });

    this.loggedUserId = this.localStorageService.getItem("loggedUserId") || "0";

    this.questionsForm = this.fb.group({
      questions: this.fb.array([this.createQuestion(1)]),
    });
  }

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments(): void {
    this.assessmentService
      .getAssessments()
      .subscribe((assessments: Assessment[]) => {
        this.assessments = assessments;
      });
  }

  createQuestion(id: number): FormGroup {
    return this.fb.group({
      id: [id, Validators.required],
      text: ["", Validators.required],
      type: ["", Validators.required],
      choices: this.fb.array([]),
      correctAnswer: ["", Validators.required],
    });
  }

  createChoice(): FormGroup {
    return this.fb.group({
      choiceText: ["", Validators.required],
    });
  }

  get questionControls() {
    return (this.questionsForm.get("questions") as FormArray).controls;
  }

  addQuestion(): void {
    const questionArray = this.questionsForm.get("questions") as FormArray;
    const newQuestionId = questionArray.length + 1;
    questionArray.push(this.createQuestion(newQuestionId));
  }

  getChoices(questionIndex: number): FormArray {
    return (this.questionsForm.get("questions") as FormArray)
      .at(questionIndex)
      .get("choices") as FormArray;
  }

  onQuestionTypeChange(questionIndex: number): void {
    const questionArray = this.questionsForm.get("questions") as FormArray;
    const question = questionArray.at(questionIndex) as FormGroup;

    const choicesArray = question.get("choices") as FormArray;
    while (choicesArray.length !== 0) {
      choicesArray.removeAt(0);
    }

    if (question.get("type")?.value === "multiple-choice") {
      for (let i = 0; i < 4; i++) {
        choicesArray.push(this.createChoice());
      }
    } else if (question.get("type")?.value === "true-false") {
      choicesArray.push(this.fb.group({ choiceText: "true" }));
      choicesArray.push(this.fb.group({ choiceText: "false" }));
    }
  }

  getMaxId(assessments: Assessment[]): number {
    return this.assessments.length;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.fileError = !this.selectedFile; // Set error if no file selected
  }

  submitAssessment(): void {
    if (!this.selectedFile) {
      this.fileError = true;
      return;
    }

    // Call the service to upload the file (which in turn calls Cloudinary)
    this.fileUploadService.uploadImage(this.selectedFile).subscribe(
      (response: any) => {
        const imageUrl = response.url; // The URL returned from Cloudinary
        // Now submit the assessment with the image URL
        const newAssessmentId = Number(this.getMaxId(this.assessments)) + 1;
        console.log("MaxId = ", this.getMaxId(this.assessments));

        const assessmentData = this.assessmentForm.value;
        const questionsData = this.questionsForm.value.questions.map(
          (question: any, index: number) => ({
            ...question,
            id: index + 1,
            choices:
              question.type === "true-false"
                ? ["true", "false"]
                : question.choices.map((choice: any) => choice.choiceText),
          })
        );

        const newAssessment = {
          id: newAssessmentId,
          assessmentName: assessmentData.assessmentName,
          assessmentDescription: assessmentData.assessmentDescription,
          assessmentImage: imageUrl, // Use the Cloudinary URL
          questions: questionsData,
          price: assessmentData.price,
          facultyId: parseInt(this.loggedUserId),
          time: assessmentData.time,
          isActive: true,
        };
        console.log("New assessment = ", newAssessment);
        // Call service to add the assessment
        this.assessmentService.addAssessment(newAssessment).subscribe(
          (response) => {
            console.log("Assessment created successfully:", response);
            this.toastr.success('Assessment created successfully') ; 
            this.loadAssessments(); // Reload assessments to get the latest list
          },
          (error) => {
            this.toastr.error("Error creating assessment")
            console.error("Error creating assessment:", error);
          }
        );
      },
      (error) => {
        this.toastr.error("Error uploading image")
        console.error("Error uploading image:", error);
      }
    );
  }
}
