export class ReviewResponse {
  rating: number;
  comment?: string;
  image_url?: string;
  username: string;
  created_at: string;

  constructor({
    rating,
    comment,
    image_url,
    username,
    created_at,
  }: {
    rating: number;
    comment?: string;
    image_url?: string;
    username: string;
    created_at: string;
  }) {
    this.rating = rating;
    this.comment = comment;
    this.image_url = image_url;
    this.username = username;
    this.created_at = created_at;
  }
}
