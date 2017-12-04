export const config = {
    errorBagName: 'errors',
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'en',
    dictionary: null,
    strict: true,
    classes: false,
    classNames: {
        touched: 'touched',
        untouched: 'untouched',
        valid: 'valid',
        invalid: 'invalid',
        pristine: 'pristine',
        dirty: 'dirty'
    },
    events: 'input|blur',
    inject: true,
    validity: false,
    aria: true
};

export default { config }