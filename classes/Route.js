import { check } from 'express-validator'
import { checkDate } from './date-schema.js'
import { checkAddress } from './Address.js'

//request body validation
export function checkRoute(){ 
    return [
    checkDate('dateOfVisit'),
    check('siteName').notEmpty().isString(),
    checkAddress('siteAddress')
    ];
}