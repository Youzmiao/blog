<template>
  <Layout>
    <template #sidebar-nav-before>
      <div v-if="route.path.startsWith('/guide/projects/')" class="project-nav">
        <h3>项目导航</h3>
        <ul>
          <li>
            <a href="/guide/projects/">项目列表</a>
          </li>
          <li>
            <a href="/guide/projects/photo-gallery-drag-layout">照片相册拖拽布局</a>
          </li>
        </ul>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const route = useRoute()
</script>

<style>
.project-nav {
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.project-nav h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-nav li {
  margin: 6px 0;
}

.project-nav a {
  display: block;
  padding: 4px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  transition: color 0.3s;
}

.project-nav a:hover {
  color: var(--vp-c-brand);
}
</style> 