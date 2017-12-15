import {AbstractControl} from '@angular/forms';

/**
 * Check if the date of given control is higher than another date
 */
export function MinDateValidator(minDate: Date) {
    return (control: AbstractControl) => {
        const currentDate = new Date(control.value);
        console.log (minDate)
        return (!control.value ||
               (currentDate.getTime() < minDate.getTime())) ?
            { minDate: true } :
            null;
    };
}
