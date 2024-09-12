export class User {
  first_name: string;
  last_name: string;
  date_of_birth: number;
  email: string;
  date_joined: string;

  constructor(obj: any) {
    this.first_name = obj ? obj.first_name : '';
    this.last_name = obj ? obj.last_name : '';
    this.date_of_birth = obj ? obj.date_of_birth : null;
    this.email = obj ? obj.email : '';
    this.date_joined = obj ? this.convertedJoinDate(obj.date_joined) : '';
  }

  convertedJoinDate(isoDateString: string): string {
    const date = new Date(isoDateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1 ).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }
}
