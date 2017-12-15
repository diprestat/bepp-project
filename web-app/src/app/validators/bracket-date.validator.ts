import {AbstractControl} from '@angular/forms';

/**
 * Check if the date bracket is good.
 */
export function BracketDateValidator(otherControl: AbstractControl) {
    return (control: AbstractControl) => {

        const minDate = new Date (otherControl.value);
        const maxDate = new Date (control.value);

        return (!control.value ||
                !otherControl.value ||
                minDate.getTime() >= maxDate.getTime()) ?
            { dateBracket: true } :
            null;
    };
}
