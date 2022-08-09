import { check } from 'express-validator'

//date validation
export function validateDate(date){
    return Boolean(date.match(/^\d{4}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][0-9]|[3][0-1])T([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])Z$/))
}

//request validation
export function checkDate(arg_name){ 
        return [
        //checking if the date matches the format.
        check(arg_name).notEmpty().custom(date =>{return validateDate(date)}),
        ];
    }
