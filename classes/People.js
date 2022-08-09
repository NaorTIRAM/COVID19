import { Patient } from "./Patient.js";
import { PotentialPatient } from "./PotentialPatient.js";
import { getSingleByID } from "./functions.js";

export class People extends Array{
    constructor(){
        super(0);//initializing empty array
        this.counterID = 0 //used for giving Unique ID's to each patient/potential-patient
    }

    //getting all people that are patients
    getAllPatients(){
        let tmp =[]
        for(let i =0; i<this.length; i++){
            if(this[i].status == 'Patient')
                tmp.push(this[i].getPublic())
        }
        return tmp
    }

    //getting all people that are potential patients
    getAllPotentialPatients(){
        let tmp =[]
        for(let i =0; i<this.length; i++){
            if(this[i].status == 'PotentialPatient')
                tmp.push(this[i].getPublic())
        }
        return tmp
    }

    //getting all encounters by patient 
    getEncountersByPatient(patient){
        let potential_patients = getPotentialPatients()
        let arr =[patient]
        for(let i=0; i< potential_patients; i++){
            if(potential_patients[i].encounteredPatient == patient)
                arr.push(potential_patients[i].getPublic())
        }
        return arr;
    }

    //getting all people that are isolated
    getIsolated(){
        let tmp =[]
        for(let i =0; i<this.length; i++)
            if(this[i].isIsolated)
                tmp.push(this[i].getPublic())
        return tmp;
    }

    //get all people that are positive since a certain date
    getPositiveSince(date){
        let tmp = []
        date = new Date(date)
        for (let i=0; i< this.length; i++)
            if(this[i].added_date  - date >= 0 && this[i].isCovidPositive )
                tmp.push(this[i].getPublic())
        return tmp
    }

    //getting a person by a unique ID
    getByID(id){
        let tmp = getSingleByID(this, id, 'patientID');
        if(!tmp)
            return getSingleByID(this, id, 'potentialPatientID');
        return tmp;
    }

    //adding a patient
    addPatient(patient){
        patient.patientID =  this.counterID.toString();
        patient = new Patient(patient)
        this.push(patient)
        this.counterID++;
    }

    //adding a potential patient
    addPotentialPatient(potential_patient, encountered_patient_id){
        potential_patient.potentialPatientID = this.counterID.toString()//adding unique id
        potential_patient = new PotentialPatient(potential_patient) //creating new potential
        this.push(potential_patient) //pushing to people
        this.getByID(encountered_patient_id).encounters.push(potential_patient.getPublic())//adding encounter to patient
        this.counterID++;
    }

    //moving a potential patient to be a patient
    movePotential(id,patient){
        let i = this.findIndex(x => x.potentialPatientID == id);
        this.splice(i, 1)
        this.addPatient(patient);
    }

    //getting from all people by status
    getByStatus(stat){
        let tmp = []
        for (let i=0; i< this.length; i++)
            if(this[i].status == stat )
                tmp.push(this[i])
        return tmp
    }

    //get all people that are COVID positive
    getAllPositive(){
        let tmp = []
        for (let i=0; i< this.length; i++)
            if(this[i].isCovidPositive)
                tmp.push(this[i])
        return tmp
    }

    //getting city statistics
    getCityStatistics(){
        let stats = [];
        for(let i =0 ;i<this.length;i++){
            if(this[i].address)// if city not inserted yet
            {
                let city_info = getSingleByID(stats, this[i].address.city, 'city')
                if(city_info)// if city already exists
                {
                    if(this[i].isCovidPositive)
                        city_info.infected++;
                }
                else //if city doesn't exist add to city list
                {
                    stats.push({city : this[i].address.city , infected:0})
                    if(this[i].isCovidPositive)
                        stats[stats.length-1].infected++;
                }
            }

        }
        return stats;
    }
}