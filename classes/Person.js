//Person class extends Object and used by Patient and PotentialPatient
export class Person extends Object{
    constructor(details)
    {
        super();
        this.firstName = details.firstName;
        this.lastName = details.lastName;
        this.phoneNumber = details.phoneNumber;

        
        //private fields
        this.status = 'Person'
        this.isIsolated=  true;
        this.isCovidPositive =  false;
        this.labtests = [];
        this.negatives_in_a_row =  0;
        this.added_date = (new Date());
    }

    //adding lab test protocol
    addLabTest(lab_test)
    {
        this.labtests.push(lab_test)
        this.isCovidPositive = lab_test.isCovidPositive
        if(lab_test.isCovidPositive == false){
            this.negatives_in_a_row++
            if(this.negatives_in_a_row >=2){
                this.isIsolated = false;
                this.status = 'Healed'
            }
        }
        else
        {
            negatives_in_a_row =0;
            this.status = 'Infected'
        }
    }
}
