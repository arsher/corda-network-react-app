export function determineSelectClasses(value) {
    let classString = 'form-control select-control';
    if (value !== '') {
        classString += ' has-value';
    }
    return classString;
}

export function determineTextareaClasses(value) {
    let classString = 'form-control message-control';
    if (value !== '') {
        classString += ' has-value';
    }
    return classString;
}
