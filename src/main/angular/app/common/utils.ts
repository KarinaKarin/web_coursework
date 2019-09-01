import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export function markControlsDirty(control: FormGroup | FormArray | FormControl | AbstractControl): void {
    if (control instanceof FormArray) {
        control.controls
            .forEach(markControlsDirty);
    } else if (control instanceof FormGroup) {
        Object.entries(control.controls)
            .map(([name, item]) => item)
            .forEach(markControlsDirty);
    } else if (control instanceof FormControl) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
    }
}