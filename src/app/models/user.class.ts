

export class User {

    first_name: string ;
    last_name: string;
    date_of_birth: number;
    email: string;


    constructor(obj: any){
        this.first_name = obj ? obj.first_name : '';
        this.last_name = obj ? obj.last_name : '';
        this.date_of_birth = obj ? obj.date_of_birth : null ;
        this.email = obj ? obj.email : '';
    }

    

}