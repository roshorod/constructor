import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  duration = 1;

  constructor(private snakBar: MatSnackBar) {
    MatSnackBarConfig
  }

  public open(message: string) {
    this.snakBar.open(message, undefined ,{
      duration: this.duration * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
