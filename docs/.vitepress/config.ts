import type { ThemeConfig } from "vitepress-theme-open17/config";
import { genFeed } from "vitepress-theme-open17/genFeed";
import { defineConfigWithTheme } from "vitepress";
import { sidebar } from "./sidebar";

import { generateSidebar } from "vitepress-sidebar";

const vitepressSidebarOptions = [
  {
    documentRootPath: "docs",
    scanStartPath: "guide",
    resolvePath: "/guide/",
    collapsed: true,
    useTitleFromFileHeading: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    rootGroupCollapsed: true,
  },
];

// 合并自动生成的侧边栏和自定义侧边栏
const generatedSidebar = generateSidebar(vitepressSidebarOptions);
const combinedSidebar = {
  ...generatedSidebar,
  ...sidebar
};

export default defineConfigWithTheme<ThemeConfig>({
  title: "柚子の猫",
  lang: "zh-CN",
  description: "我的个人博客与作品展示",
  markdown: {
    math: true,
  },
  sitemap: {
    hostname: "https://yourwebsite.com",
  },
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["meta", { name: "keywords", content: "个人网站, 博客, 作品集" }],
  ],
  themeConfig: {
    sidebar: combinedSidebar,
    search: {
      provider: "local",
      options: {
        _render(src, env, md) {
          const html = md.render(src, env);
          if (env.frontmatter?.title)
            return md.render(`# ${env.frontmatter.title}`) + html;
          return html;
        },
      },
    },
    editLink: {
      pattern: "",
      text: ""
    },
    feed: {
      baseUrl: "https://yourwebsite.com",
      copyright: "Copyright © 2024-present",
      image: "/logo.png",
    },
    blog: {
      tagPageLink: "/page/tags",
      bgImage: { dark: "/bg_dark.jpg" },
      direct: "lft",
      user: {
        name: "柚子の猫",
        avatar: "/ava.jpg",
        describe: "个人简介：Web开发者 | 运动爱好者 | 终身学习者",
      },
    },
    home: {
      maxTagsDisplayed: 20,
      postsPerPage: 5,
    },
    comment: {
      use: false,
    },
    logo: {
      dark: "/logo.png",
      light: "/logo_light.png",
    },
    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "博客", link: "/page/blog" },
      { text: "项目", link: "/guide/projects/" },
      { text: "个人简介", link: "/page/about" },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Youzmiao",
      },
    ],
  },
  buildEnd: genFeed,
});
