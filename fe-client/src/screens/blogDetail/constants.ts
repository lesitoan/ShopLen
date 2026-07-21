import type { BlogDetail, BlogPost } from "@/types/blog.type";

export const MOCK_BLOG_DETAILS: Record<string, BlogDetail> = {
  "bai-viet-chi-tiet-1": {
    id: 1,
    slug: "bai-viet-chi-tiet-1",
    title: "Cách móc gấu bông từ len sợi chi tiết từ A đến Z cho người mới bắt đầu",
    excerpt: "Hướng dẫn đầy đủ từng bước móc gấu bông len với các mũi móc cơ bản, phù hợp cho người chưa có kinh nghiệm.",
    thumbnail: "/images/products/gau-bong-tho.png",
    tag: "huong-dan-moc",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "20 tháng 7, 2025",
    readTime: "8 phút đọc",
    toc: [
      { id: "chuon-bi-nguyen-lieu", title: "1. Chuẩn bị nguyên liệu và dụng cụ", level: 2 },
      { id: "cac-mui-moc-co-ban", title: "2. Các mũi móc cơ bản cần nắm vững", level: 2 },
      { id: "quy-trinh-moc-gau", title: "3. Quy trình móc phần đầu và thân gấu", level: 2 },
      { id: "hoan-thien-san-pham", title: "4. Ráp các bộ phận và hoàn thiện", level: 2 },
    ],
    content: `
      <p>Móc len không chỉ là một sở thích thư giãn tuyệt vời mà còn giúp bạn tự tay tạo ra những món quà vô cùng đáng yêu và ý nghĩa. Bài viết này sẽ hướng dẫn bạn cách móc một chú gấu bông xinh xắn từng bước một vô cùng dễ hiểu.</p>

      <h2 id="chuon-bi-nguyen-lieu">1. Chuẩn bị nguyên liệu và dụng cụ</h2>
      <p>Để bắt đầu thực hiện chú gấu bông len, bạn cần chuẩn bị đầy đủ các dụng cụ sau:</p>
      <ul>
        <li><strong>Len sợi Milk Cotton 50g:</strong> 1 cuộn màu nâu nhạt hoặc màu hồng pastel cho phần thân, 1 cuộn màu kem cho phần mõm.</li>
        <li><strong>Kim móc:</strong> Sử dụng kim móc 2.5mm - 3.0mm.</li>
        <li><strong>Bông gòn nhồi:</strong> Bông gòn công nghiệp cao cấp mềm mịn.</li>
        <li><strong>Mắt thú nhựa:</strong> 1 cặp mắt xoay 6mm - 8mm.</li>
        <li>Kim khâu len, kéo nhỏ và ghim đánh dấu mũi móc.</li>
      </ul>

      <img src="/images/products/gau-bong-tho.png" alt="Bộ nguyên liệu móc gấu bông len" />

      <h2 id="cac-mui-moc-co-ban">2. Các mũi móc cơ bản cần nắm vững</h2>
      <p>Trước khi đi vào từng phần, hãy đảm bảo bạn đã quen thuộc với 3 mũi móc chính:</p>
      <ol>
        <li><strong>Vòng tròn ma thuật (MR):</strong> Điểm khởi đầu cho các bộ phận hình tròn.</li>
        <li><strong>Mũi móc đơn (X):</strong> Mũi móc tạo độ chặt và đứng phom cho gấu bông.</li>
        <li><strong>Mũi tăng (V) & Mũi giảm (A):</strong> Giúp mở rộng hoặc thu hẹp kích thước.</li>
      </ol>

      <blockquote>
        Mẹo nhỏ từ Nhà Kiều: Khi móc thú bông amigurumi, bạn nên móc chặt tay một chút để khi nhồi bông không bị hở lỗ bông ra ngoài.
      </blockquote>

      <h2 id="quy-trinh-moc-gau">3. Quy trình móc phần đầu và thân gấu</h2>
      <p>Chúng ta sẽ tiến hành móc theo hình xoắn ốc (spiral pattern), dùng ghim đánh dấu mũi đầu tiên của mỗi hàng.</p>

      <img src="/images/products/moc-khoa-gau.png" alt="Móc phần thân gấu bông" />

      <h2 id="hoan-thien-san-pham">4. Ráp các bộ phận và hoàn thiện</h2>
      <p>Sau khi đã hoàn thành đầu, thân, 2 tay, 2 chân và tai, bạn tiến hành nhồi bông vừa phải. Dùng kim khâu len để khâu ráp các bộ phận lại với nhau. Cuối cùng, thêu thêm chiếc mũi nhỏ xinh bằng chỉ màu đen để hoàn thiện sản phẩm!</p>
    `,
  },
  "cach-moc-gau-bong-tu-len-soi-chi-tiet": {
    id: 1,
    slug: "cach-moc-gau-bong-tu-len-soi-chi-tiet",
    title: "Cách móc gấu bông từ len sợi chi tiết từ A đến Z cho người mới bắt đầu",
    excerpt: "Hướng dẫn đầy đủ từng bước móc gấu bông len với các mũi móc cơ bản, phù hợp cho người chưa có kinh nghiệm.",
    thumbnail: "/images/products/gau-bong-tho.png",
    tag: "huong-dan-moc",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "20 tháng 7, 2025",
    readTime: "8 phút đọc",
    toc: [
      { id: "chuon-bi-nguyen-lieu", title: "1. Chuẩn bị nguyên liệu và dụng cụ", level: 2 },
      { id: "cac-mui-moc-co-ban", title: "2. Các mũi móc cơ bản cần nắm vững", level: 2 },
      { id: "quy-trinh-moc-gau", title: "3. Quy trình móc phần đầu và thân gấu", level: 2 },
      { id: "hoan-thien-san-pham", title: "4. Ráp các bộ phận và hoàn thiện", level: 2 },
    ],
    content: `
      <p>Móc len không chỉ là một sở thích thư giãn tuyệt vời mà còn giúp bạn tự tay tạo ra những món quà vô cùng đáng yêu và ý nghĩa. Bài viết này sẽ hướng dẫn bạn cách móc một chú gấu bông xinh xắn từng bước một vô cùng dễ hiểu.</p>

      <h2 id="chuon-bi-nguyen-lieu">1. Chuẩn bị nguyên liệu và dụng cụ</h2>
      <p>Để bắt đầu thực hiện chú gấu bông len, bạn cần chuẩn bị đầy đủ các dụng cụ sau:</p>
      <ul>
        <li><strong>Len sợi Milk Cotton 50g:</strong> 1 cuộn màu nâu nhạt hoặc màu hồng pastel cho phần thân, 1 cuộn màu kem cho phần mõm.</li>
        <li><strong>Kim móc:</strong> Sử dụng kim móc 2.5mm - 3.0mm.</li>
        <li><strong>Bông gòn nhồi:</strong> Bông gòn công nghiệp cao cấp mềm mịn.</li>
        <li><strong>Mắt thú nhựa:</strong> 1 cặp mắt xoay 6mm - 8mm.</li>
        <li>Kim khâu len, kéo nhỏ và ghim đánh dấu mũi móc.</li>
      </ul>

      <img src="/images/products/gau-bong-tho.png" alt="Bộ nguyên liệu móc gấu bông len" />

      <h2 id="cac-mui-moc-co-ban">2. Các mũi móc cơ bản cần nắm vững</h2>
      <p>Trước khi đi vào từng phần, hãy đảm bảo bạn đã quen thuộc với 3 mũi móc chính:</p>
      <ol>
        <li><strong>Vòng tròn ma thuật (MR):</strong> Điểm khởi đầu cho các bộ phận hình tròn.</li>
        <li><strong>Mũi móc đơn (X):</strong> Mũi móc tạo độ chặt và đứng phom cho gấu bông.</li>
        <li><strong>Mũi tăng (V) & Mũi giảm (A):</strong> Giúp mở rộng hoặc thu hẹp kích thước.</li>
      </ol>

      <blockquote>
        Mẹo nhỏ từ Nhà Kiều: Khi móc thú bông amigurumi, bạn nên móc chặt tay một chút để khi nhồi bông không bị hở lỗ bông ra ngoài.
      </blockquote>

      <h2 id="quy-trinh-moc-gau">3. Quy trình móc phần đầu và thân gấu</h2>
      <p>Chúng ta sẽ tiến hành móc theo hình xoắn ốc (spiral pattern), dùng ghim đánh dấu mũi đầu tiên của mỗi hàng.</p>

      <img src="/images/products/moc-khoa-gau.png" alt="Móc phần thân gấu bông" />

      <h2 id="hoan-thien-san-pham">4. Ráp các bộ phận và hoàn thiện</h2>
      <p>Sau khi đã hoàn thành đầu, thân, 2 tay, 2 chân và tai, bạn tiến hành nhồi bông vừa phải. Dùng kim khâu len để khâu ráp các bộ phận lại với nhau. Cuối cùng, thêu thêm chiếc mũi nhỏ xinh bằng chỉ màu đen để hoàn thiện sản phẩm!</p>
    `,
  },
};

export const RELATED_POSTS: BlogPost[] = [
  {
    id: 2,
    slug: "qua-tang-handmade-y-nghia-cho-ban-than",
    title: "Quà tặng handmade ý nghĩa cho bạn thân dịp sinh nhật",
    excerpt: "Những ý tưởng quà tặng móc len độc đáo, tự tay làm mang theo tình cảm chân thành nhất.",
    thumbnail: "/images/products/binh-hoa-tulip.png",
    tag: "y-tuong-qua-tang",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "18 tháng 7, 2025",
    readTime: "5 phút đọc",
  },
  {
    id: 3,
    slug: "meo-chon-len-soi-chat-luong-cho-nguoi-moi",
    title: "Mẹo chọn len sợi chất lượng cho người mới học móc len",
    excerpt: "Phân biệt các loại sợi len phổ biến và cách chọn sợi phù hợp với từng loại sản phẩm.",
    thumbnail: "/images/products/moc-khoa-meo.png",
    tag: "meo-hay",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "15 tháng 7, 2025",
    readTime: "6 phút đọc",
  },
  {
    id: 4,
    slug: "huong-dan-moc-hoa-tulip-len-dep",
    title: "Hướng dẫn móc hoa tulip len đẹp như thật tặng người thân yêu",
    excerpt: "Móc hoa tulip không hề khó như bạn nghĩ. Với hướng dẫn chi tiết này, bạn sẽ có ngay bó hoa len xinh xắn.",
    thumbnail: "/images/products/hoa-tulip.png",
    tag: "huong-dan-moc",
    author: "Nhà Kiều",
    authorAvatar: "/logo.png",
    publishedAt: "14 tháng 7, 2025",
    readTime: "7 phút đọc",
  },
];

export function getPostBySlug(slug: string): BlogDetail | null {
  return MOCK_BLOG_DETAILS[slug] ?? MOCK_BLOG_DETAILS["bai-viet-chi-tiet-1"] ?? null;
}
