

export default function validate(values) {
    let errors = {};

        var s = parseInt(values.number);
        var p = parseInt(values.number);
    
        if (!values.name) {
            errors.name = "Please enter product name!";
        } else errors.name ="";

        if (!values.price) {
            errors.price = "Please enter product price!";
        } else if (isNaN(values.price)) {
            errors.price = "Price must be a number!";
        } else if(values.price < 0) {
            errors.price = "Price must be a positive number!";
        } else errors.price = "";

    
        if (!values.number) {
            errors.price = "Please enter number of products!";
        } else if (isNaN(values.number)) {
            errors.number = "Number of products must be a number!";
        } else if(s.toString() !== values.number) {
            errors.number ="Number of products must be an integer!";
        } else if(values.number < 0) {
            errors.number = "Number of products must be a positive number!";
        } else errors.number = "";

        if (!values.discount) {
            errors.discount = "Please enter product discount!";
        } else if (isNaN(values.discount)) {
            errors.discount = "Discount must be a number!";
        } else if(p.toString() !== values.number) {
            errors.discount ="Discount must be an integer!";
        } else if(values.number < 0 || values.number > 100 ) {
            errors.discount = "Discount must be in range from 0 to 100!";
        } else errors.discount = "";
    return errors;
  };