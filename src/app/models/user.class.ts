export class User {

  first_name: string;
  last_name: string;
  date_of_birth: number;
  email: string;
  date_joined: string;
  street: string;
  street_number: number;
  zip_code: number;
  city: string;
  country: string;
  phone_number: number;
  my_videos;

  constructor(obj: any) {
    this.first_name = obj ? obj.first_name : '';
    this.last_name = obj ? obj.last_name : '';
    this.date_of_birth = obj ? obj.date_of_birth : null;
    this.email = obj ? obj.email : '';
    this.date_joined = obj ? this.convertedJoinDate(obj.date_joined) : '';
    this.street = obj ? obj.street : '';
    this.street_number = obj ? obj.street_number: null;
    this.zip_code = obj ? obj.zip_code : null;
    this.city = obj ? obj.city : '';
    this.country = obj ? obj.country : '';
    this.phone_number = obj ? obj.phone_number : null;
    this.my_videos = obj ? obj.my_videos : null;
  }

  convertedJoinDate(isoDateString: string): string {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1 ).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }

}
