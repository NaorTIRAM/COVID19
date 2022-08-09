import { Person } from "./Person.js";
import { check }  from 'express-validator';
import { checkPrimaryDetails } from "./PotentialPatient.js";
import { checkDate } from "./date-schema.js";
import { checkAddress } from "./Address.js";
import { isUnique } from "./functions.js";

//Patient class extends person properties
export class Patient extends Person{ 
    constructor(patient){
        super(patient)
        this.patientID =  patient.patientID;
        this.govtID = patient.govtID;
        this.birthDate = patient.birthDate;
        this.email = patient.email;
        this.address = patient.address;
        this.houseResidentsAmount = patient.houseResidentsAmount;
        this.isCovidPositive = patient.isCovidPositive;

        //private fields
        this.status= 'Patient';
        this.routes= [];
        this.encounters= [];
    }
    
    getPublic(){
        //return object without these fields
        const { added_date, routes,labtests, encounters, status, isIsolated, isCovidPositive, negatives_in_a_row, ...publicObject } = this
        return publicObject;
    }

    //getting all encounters
    getAllEncounters(){
        let encounters =[]
        for(let i =0; i< this.encounters.length; i++){
            encounters.push(
                {
                    potentialPatientDetails: this.encounters[i],
                    encounteredPatient: this.getPublic()
                }
            )
        }
        return encounters;
    }
}   

//request body validation
export function checkPatient(people){ 
    return [
    checkPrimaryDetails(),
    check('govtID').notEmpty().isString().custom((value)=> {return  isUnique(people.getAllPatients(),value,'govtID')}),
    checkDate('birthDate'),
    check('email').notEmpty().isString(),
    checkAddress('address'),
    check('houseResidentsAmount').notEmpty().isInt(),
    check('isCovidPositive').notEmpty().isBoolean()
    ];
}