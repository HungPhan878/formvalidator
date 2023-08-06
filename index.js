function validate(formSelection) {
    const _this = this;
    const $ = document.querySelector.bind(document);

    // tao ra formRules
    const formRules = {};
    const formValidator = {
        required(value) {
            return value ? undefined : "Please enter the field";
        },
        email(value) {
            let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
            return regex.test(value)
                ? undefined
                : "Please enter the email again";
        },
        min(min) {
            return function (value) {
                return value.length > min
                    ? undefined
                    : "Please enter all characters";
            };
        },

        confirm(value) {
            const isConfirm = document.querySelector(
                "input[type=password]"
            ).value;
            return value === isConfirm
                ? undefined
                : "Please enter the password again";
        },
    };
    // get parent
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
        }
        element = element.parentElement;
    }

    // form elements
    const formElement = $(formSelection);
    if (formElement) {
        const inputs = formElement.querySelectorAll("[name][rules]");
        if (inputs) {
            for (var input of inputs) {
                const rules = input.getAttribute("rules").split("|");
                if (rules) {
                    for (var rule of rules) {
                        // in la lay ra key
                        //of la lay ra value
                        let ruleInfo;
                        const isRuleHasValue = rule.includes(":");
                        if (isRuleHasValue) {
                            ruleInfo = rule.split(":");
                            rule = ruleInfo[0];
                        }
                        let ruleFunc = formValidator[rule];
                        if (isRuleHasValue) {
                            ruleFunc = ruleFunc(ruleInfo[1]);
                        }
                        // create rules
                        if (Array.isArray(formRules[input.name])) {
                            formRules[input.name].push(ruleFunc);
                        } else {
                            formRules[input.name] = [ruleFunc];
                        }
                    }
                }
                // events
                input.onblur = handleFunction;
                input.oninput = clearFunction;
            }
            // function
            function handleFunction(e) {
                const rules = formRules[e.target.name];
                let errorMessage;
                for (let rule of rules) {
                    errorMessage = rule(e.target.value);
                    if (errorMessage) {
                        break;
                    }
                }
                if (errorMessage) {
                    const formGroup = getParent(e.target, ".form-group");
                    if (formGroup) {
                        formGroup.classList.add("invalid");
                        const formMessage =
                            formGroup.querySelector(".form-message");
                        formMessage.innerHTML = errorMessage;
                    }
                }
                return !errorMessage;
            }
            function clearFunction(e) {
                const formGroup = getParent(e.target, ".form-group");
                if (formGroup.classList.contains("invalid")) {
                    formGroup.classList.remove("invalid");
                    const formMessage =
                        formGroup.querySelector(".form-message");
                    formMessage.innerHTML = "";
                }
            }
        }
    }

    // onsubmit event
    formElement.onsubmit = function (e) {
        e.preventDefault();
        const inputs = formElement.querySelectorAll("[name][rules]");
        let isValid = true;
        if (inputs) {
            for (var input of inputs) {
                if (!handleFunction({ target: input })) {
                    isValid = false;
                }
            }
            if (isValid) {
                if (typeof _this.onsubmit === "function") {
                    const enableInput = formElement.querySelectorAll("[name]");
                    const formValue = Array.from(enableInput).reduce(function (
                        values,
                        input
                    ) {
                        switch (input.type) {
                            case "radio":
                                console.log(input.name);
                                values[input.name] = document.querySelector(
                                    'input[name="' + input.name + '"]:checked'
                                ).value;
                                // phai dung dung bo chon selector
                                break;
                            case "checkbox":
                                if (!input.matches(":checked")) {
                                    // values[input.name] = [];
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                // phai suy xet mot cach co logic

                                break;
                            case "file":
                                values[input.name] = input.file;
                                break;

                            default:
                                values[input.name] = input.value;
                                break;
                        }
                        return values;
                    },
                    {});

                    _this.onsubmit(formValue);
                } else {
                    formElement.submit();
                }
            }fished
        }
    };
}
