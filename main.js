function Validator(options) {
    //perform validation
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);
        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
    }
    // get element in form validate
    var formElement = document.querySelector(options.form);
    console.log(formElement)
    if (formElement) {
        options.rules.forEach(rule => {
            var inputElement = document.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule)
                }
                inputElement.oninput = () => {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }

}
//define rules
Validator.isRequired = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : 'Please Enter This Field'
        }
    }
}
Validator.isEmail = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Please Enter Valid Email';
        }
    }
}
Validator.minLength = (selector, min) => {
    return {
        selector: selector,
        test: (value) => {

            return value.length >= min ? undefined : `Password needs a minimum of ${min} characters`;
        }
    }
}
Validator.isConfirmed = (selector, confirmValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === confirmValue() ? undefined : message;
        }
    }
}
//output
Validator({
    form: "#form-1",
    rules: [Validator.isRequired("#fullname"),
    Validator.isEmail("#email"),
    Validator.minLength("#password", 6),
    Validator.isConfirmed('#password_confirmation', function () {
        return document.querySelector('#form-1 #password').value
    }, 'Re - entered password is incorrect')],
    errorSelector: '.form-message'
});

