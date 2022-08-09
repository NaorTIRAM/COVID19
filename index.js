import express from 'express';
const app = express();
const PORT =process.env.PORT || 3000; //listening on port 3000

app.use(express.json()) //using express to parse json requests
import { check, validationResult }  from 'express-validator';
import { checkPatient } from "./classes/Patient.js";
import { checkRoute } from "./classes/Route.js";
import { validateDate } from './classes/date-schema.js'
import { checkLabTest } from './classes/LabTests.js';
import { checkPrimaryDetails } from './classes/PotentialPatient.js';
import { dataBase } from './classes/DataBase.js'

//initializing dataset.
app.data_base = new dataBase();

// initializing the app
app.listen(
    PORT,
   () => {console.log(`listening on port ${PORT}`)}
)

//get patients request
app.get(`/patients`, (req, res) => {
    //getting all patients and sending
    res.status(200).send(app.data_base.people.getAllPatients())
});

//put new patient request
app.put(`/patients`,
    checkPatient(app.data_base.people),
    (req,res)=>{
        //error handling
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).send(errors);

        //handling valid request
        app.data_base.people.addPatient(req.body);
        return res.status(200).send({patientID: app.data_base.people[app.data_base.people.length-1].patientID});
});

//get full patient
app.get(`/patients/:id/full`,(req,res)=>{
    const {id} = req.params;

    let person = app.data_base.people.getByID(id)
    if(!person)   //incase patient doesn't exist 
        return res.status(400).send(`error person with ID = ${id} not found`)
    
    //returning relevant data
    return res.status(200).send(
        {
            Patient: person.getPublic(),
            isCovidPositive: person.isCovidPositive,
            labResults: person.labtests
        }
    );
});

//put route request
app.put(`/patients/:id/route` ,   
checkRoute(),
(req,res)=>{
    //error handling
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).send(errors);

    const {id} = req.params;
    let person = app.data_base.people.getByID(id)
    if(!person || person.status != 'Patient')    //incase patient doesn't exist 
        return res.status(400).send(`error patient with ID = ${id} not found`)
    
    //adding route
    person.routes.push(req.body)
    return res.status(200).send({});
});

//get route by id
app.get(`/patients/:id/route`,(req,res)=>{

    const {id} = req.params;
    let person = app.data_base.people.getByID(id)
    if(!person || person.status != 'Patient')    //incase patient doesn't exist 
        return res.status(400).send(`error patient with ID = ${id} not found`)

    //returning the patient's routes
    return res.status(200).send(person.routes);
})

//put encounters request
app.put(`/patients/:id/encounters` ,   
checkPrimaryDetails(),
(req,res)=>{
    //error handling
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).send(errors);

    const {id} = req.params;
    let person = app.data_base.people.getByID(id)
    if(!person || person.status != 'Patient')    //incase patient doesn't exist 
        return res.status(400).send(`error patient with ID = ${id} not found`)
    
    //adding potential patient to database
    app.data_base.people.addPotentialPatient(req.body, id)
    //returning the potential person
    let potential_patient = app.data_base.people[app.data_base.people.length -1].getPublic()
    return res.status(200).send({
        firstName: potential_patient.firstName,
        lastName: potential_patient.lastName,
        phoneNumber: potential_patient.phoneNumber
    });
});

//get encounters by id
app.get(`/patients/:id/encounters`,(req,res)=>{

     const {id} = req.params;
     let person = app.data_base.people.getByID(id)
     if(!person || person.status != 'Patient')    //incase patient doesn't exist 
         return res.status(400).send(`error patient with ID = ${id} not found`)

    //returning the patient's encounters
    return res.status(200).send(person.getAllEncounters());
})

//get all sick since time
app.get(`/patients/new`,(req,res)=>{
    const value = req.query.since;

    //check date format
    if(!validateDate(value))
        return res.status(400).send(`invalid date ${value}`)

    //find patients after value and insert to tmp
    let arr = app.data_base.people.getPositiveSince(value)
    
    //returning all the patients after since
    return res.status(200).send(arr)
});

//post labtest
app.post(`/labtests` ,
    checkLabTest(app.data_base.labtests),
    (req,res)=>{
        //error handling
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).send(errors);

        let person = app.data_base.people.getByID(req.body.patientID)
        if(!person)   //incase patient doesn't exist 
            return res.status(400).send(`error person with ID = ${req.body.patientID} not found`)

        //adding labtest to database
        app.data_base.labtests.push(req.body)
        //referring labtest to a person
        person.addLabTest(req.body)
        return res.status(200).send({patientID: req.body.patientID});
    }
);

//get potential patients
app.get('/patients/potential',
    (req,res)=>{
        //returning all potential patients and their encounters
        return res.status(200).send(app.data_base.people.getAllPotentialPatients())
    }
);

//get all isolated
app.get('/patients/isolated',
    (req,res)=>{
        //returning all people isolated
        return res.status(200).send(app.data_base.people.getIsolated());
    }
);

//post potential to patient
app.post('/patients/potential/:potentialPatientId',
    checkPatient(app.data_base.people),
    (req,res)=>{
        //error handling
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).send(errors);

        const {potentialPatientId} = req.params;
        let potential_patient = app.data_base.people.getByID(potentialPatientId)
        if(!potential_patient || potential_patient.status != 'PotentialPatient')
            return res.status(400).send(`error potential patient with ID = ${potentialPatientId} not found`)

        //moving from potential to patient status
        app.data_base.people.movePotential(potentialPatientId,req.body)
        //returning the patient created
        return res.status(200).send({patientID: app.data_base.people[app.data_base.people.length-1].patientID});
    }
);

//get statistics
app.get('/statistics',
    (req,res)=>{
        //calculating the city statistics
        let cityStatistics = app.data_base.people.getCityStatistics()
        //returning statistics
        return res.status(200).send({
            infected: app.data_base.people.getAllPositive().length,
            healed: app.data_base.people.getByStatus('Healed').length,
            isolated: app.data_base.people.getIsolated().length,
            cityStatistics: cityStatistics
        });
    }
);

export default app; // for testing
