export class VideoItem {
    title: string ;
    description: string ;
    released_at: string ;
    genre: string ;
    video_file: any ;
    cover_image: any ;
    rating: number;
    url: string;
    duration: number;
    timestamp;

    constructor(obj: any){
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.released_at = obj ? obj.released_at : '';
        this.genre = obj ? obj.genre : '';
        this.video_file = obj ? obj.video_file : '';
        this.cover_image = obj ? obj.cover_image : '';
        this.rating = obj ? obj.rating : 1;
        this.url = obj ? obj.url : '';
        this.duration = obj ? obj.duration : 0;
        this.timestamp = obj ? obj.timestamp : null;
    }

}