import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-drawer",
  templateUrl: "./drawer.component.html",
  styleUrls: ["./drawer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  cropsMock = ["corn", "potato", "pumpkin", "carrot"];

  selectedCrop: string = "";
  cropSize: number = 0;
  cropDate: string = "";
  formError: boolean = false;
  tomorrow: string;
  isCropPlanningActive: boolean = true;

  constructor() {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1); // Set to tomorrow
    this.tomorrow = tomorrowDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }

  setActiveTab(tab: string) {
    switch (tab) {
      case "cropPlanning":
        this.isCropPlanningActive = true;
        break;
      case "harvestHistory":
        this.isCropPlanningActive = false;
        break;
    }
  }

  decreaseSize() {
    if (this.cropSize > 0) {
      this.cropSize--;
    }
  }

  increaseSize() {
    this.cropSize++;
  }

  submitForm() {
    if (!this.selectedCrop || !this.cropSize || !this.cropDate) {
      this.formError = true;
      return;
    }

    // Handle form submission logic here
    console.log("Crop:", this.selectedCrop);
    console.log("Size:", this.cropSize);
    console.log("Date:", this.cropDate);

    // Reset form after submission if needed
    this.resetForm();
  }

  resetForm() {
    this.selectedCrop = "";
    this.cropSize = 0;
    this.cropDate = "";
    this.formError = false;
  }
}
