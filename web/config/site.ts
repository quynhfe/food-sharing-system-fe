export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "GreenShare",
  description:
    "Nền tảng chia sẻ thực phẩm cộng đồng - Giảm lãng phí, xây dựng cộng đồng bền vững.",
  navItems: [
    {
      label: "Trang chủ",
      href: "/",
    },
    {
      label: "Cách hoạt động",
      href: "/#how-it-works",
    },
    {
      label: "Tác động",
      href: "/#impact",
    },
    {
      label: "Đăng nhập",
      href: "/login",
    },
  ],
  navMenuItems: [
    {
      label: "Trang chủ",
      href: "/",
    },
    {
      label: "Khám phá",
      href: "/feed",
    },
    {
      label: "Đăng món",
      href: "/post/create",
    },
    {
      label: "Tin nhắn",
      href: "/messages",
    },
    {
      label: "Tác động",
      href: "/impact",
    },
    {
      label: "Hồ sơ",
      href: "/profile",
    },
    {
      label: "Đăng xuất",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
};
