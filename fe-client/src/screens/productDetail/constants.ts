import type { ProductComment } from "./types";

export const INITIAL_COMMENTS: ProductComment[] = [
  {
    id: 3,
    author: "Nguyễn Minh Thảo",
    avatar: "T",
    avatarBg: "bg-blue-100 text-blue-600",
    comment: "Sản phẩm siêu đáng yêu luôn nha mọi người, đường móc rất đều và chắc chắn. Shop đóng gói cực kỳ cẩn thận, có tặng kèm thiệp viết tay xinh xắn nữa.",
    date: "2 ngày trước",
    likes: 18,
    isLiked: false,
    isDisliked: false,
    replies: [
      {
        id: 101,
        author: "Tiệm Len Nhà Kiều",
        avatar: "K",
        avatarBg: "bg-primary-light text-secondary border border-primary/20",
        comment: "Cảm ơn bạn Thảo nhiều nha! Sự ủng hộ của bạn là động lực lớn cho Tiệm ạ. Chúc bạn một ngày ngập tràn niềm vui!",
        date: "1 ngày trước",
        likes: 5,
        isLiked: false,
        isDisliked: false,
      },
    ],
  },
  {
    id: 2,
    author: "Trần Anh Kiên",
    avatar: "K",
    avatarBg: "bg-green-100 text-green-600",
    comment: "Đã mua lần thứ hai của shop để làm quà sinh nhật cho bạn bè. Ai nhận cũng khen nức nở vì cún bông móc len nhìn cưng xỉu. Sẽ tiếp tục ủng hộ shop.",
    date: "1 tuần trước",
    likes: 12,
    isLiked: false,
    isDisliked: false,
    replies: [],
  },
  {
    id: 1,
    author: "Lê Khánh Vy",
    avatar: "V",
    avatarBg: "bg-yellow-100 text-yellow-600",
    comment: "Móc khóa chắc chắn, màu sắc tươi sáng giống hệt như ảnh chụp trên web. Thời gian chuẩn bị hàng hơi lâu một chút vì là đồ handmade làm thủ công nhưng rất bõ công chờ.",
    date: "2 tuần trước",
    likes: 7,
    isLiked: false,
    isDisliked: false,
    replies: [],
  },
];

export const AVATAR_BG_OPTIONS = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600",
  "bg-purple-100 text-purple-600",
  "bg-indigo-100 text-indigo-600",
  "bg-pink-100 text-pink-600",
];
