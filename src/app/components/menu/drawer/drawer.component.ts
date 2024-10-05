import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-drawer",
  templateUrl: "./drawer.component.html",
  styleUrls: ["./drawer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  cropsMock = [
    "corn",
    "potato",
    "pumpkin",
    "carrot",
  ];
}
