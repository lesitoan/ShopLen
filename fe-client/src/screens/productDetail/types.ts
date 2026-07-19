export interface CommentReply {
  id: number;
  author: string;
  avatar: string;
  avatarBg: string;
  comment: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface ProductComment {
  id: number;
  author: string;
  avatar: string;
  avatarBg: string;
  comment: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies: CommentReply[];
}
