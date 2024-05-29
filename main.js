function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {}
    //perform validation
    function validate(inputElement, rule) {
        var errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage
        //lấy các rule của selector
        var rules = selectorRules[rule.selector]
        //lặp qua các rule
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break;
                default: errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }
        else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage
    }
    // get element in form validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault()
            var isFormValid = true;
            //lap qua tung rule va validate
            options.rules.forEach(rule => {
                var inputElement = document.querySelector(rule.selector);
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]:not([disabled])')
                    console.log(Array.from(enableInput))
                    var formValue = Array.from(enableInput).reduce(function (values, input) {
                        switch (input.type) {
                            case 'radio':
                                if (!([input.name] in values)) {
                                    if (!input.matches(':checked')) {
                                        values[input.name] = "";
                                    }
                                    else {
                                        values[input.name] = input.value;
                                    }
                                }
                                else {
                                    if (input.matches(':checked')) {
                                        values[input.name] = input.value;
                                    }

                                }
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default: values[input.name] = input.value;
                        }
                        return values
                    }, {});
                    options.onSubmit(formValue)

                }
                //Submit theo trinh duyet mac dinh
                else {
                    formElement.submit();
                }
            }
        }
    }
    //lặp qua các rule và lắng nghe các sự kiện
    if (formElement) {

        options.rules.forEach(rule => {

            //Save rules for each input field
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }
            var inputElements = document.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach((inputElement) => {
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }
                inputElement.oninput = () => {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })
        });
        console.log(selectorRules)
    }

}
//define rules
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value ? undefined : message || 'Please Enter This Field'
        }
    }
}
Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please Enter Valid Email';
        }
    }
}
Validator.minLength = (selector, min, message) => {
    return {
        selector: selector,
        test: (value) => {

            return value.length >= min ? undefined : message || `Password needs a minimum of ${min} characters`;
        }
    }
}
Validator.isConfirmed = (selector, confirmValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === confirmValue() ? undefined : message || 'Input value is incorrect';
        }
    }
}
//output
Validator({
    form: "#form-1",
    formGroupSelector: '.form-group',
    rules: [Validator.isRequired("#fullname"),
    Validator.isRequired('#email'),
    Validator.isEmail("#email"),
    Validator.isRequired('#password'),
    Validator.minLength("#password", 6),
    Validator.isRequired('input[name="gender"]'),
    Validator.isRequired('#province'),
    Validator.isRequired('#avatar'),
    Validator.isConfirmed('#password_confirmation', function () {
        return document.querySelector('#form-1 #password').value
    }, 'Re - entered password is incorrect')],
    onSubmit: function (data) {
        console.log(data)
    },
    errorSelector: '.form-message'
});

