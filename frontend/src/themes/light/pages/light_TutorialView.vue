<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

const route = useRoute()

const renderedContent = ref('')
const currentLang = ref('en') // 'zh' for Chinese, 'en' for English
const markdownBody = ref(null)
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
md.use(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.ariaHidden({
    placement: 'before',
    symbol: '#',
    space: true,
    class: 'header-anchor'
  }),
  slugify: s =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
})

const getTutorialFile = () => (currentLang.value === 'en' ? '/tutorial-en.md' : '/tutorial-zh.md')

const scrollToHash = () => {
  // Wait for DOM to update, then scroll to hash if present
  nextTick(() => {
    if (route.hash) {
      // Remove the '#' from the hash
      const targetId = route.hash.slice(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  })
}

const addCopyButtons = () => {
  nextTick(() => {
    const container = markdownBody.value
    if (!container) return
    const blocks = container.querySelectorAll('pre')
    blocks.forEach((block) => {
      if (block.querySelector('.copy-code-btn')) return
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'copy-code-btn'
      button.textContent = 'Copy'
      button.addEventListener('click', async () => {
        const code = block.querySelector('code')
        const text = code ? code.innerText : block.innerText
        try {
          await navigator.clipboard.writeText(text)
          button.textContent = 'Copied'
          setTimeout(() => {
            button.textContent = 'Copy'
          }, 1200)
        } catch (error) {
          console.error('Failed to copy code: ', error)
        }
      })
      block.classList.add('has-copy-button')
      block.appendChild(button)
    })
  })
}

const loadTutorial = async () => {
  try {
    const response = await fetch(getTutorialFile())
    if (response.ok) {
      let text = await response.text()
      // Fix media paths to point to /media/ (absolute path from public root)
      // For markdown images: ![alt](media/file.png) -> ![alt](/media/file.png)
      text = text.replace(/\]\(media\//g, '](/media/')
      // For HTML image tags: src="media/file.gif" -> src="/media/file.gif"
      text = text.replace(/src="media\//g, 'src="/media/')
      
      renderedContent.value = md.render(text)
      addCopyButtons()
      scrollToHash()
    } else {
      console.error('Failed to fetch tutorial markdown')
    }
  } catch (error) {
    console.error('Failed to load tutorial:', error)
  }
}

const switchLang = (lang) => {
  if (currentLang.value !== lang) {
    currentLang.value = lang
    loadTutorial()
  }
}

onMounted(() => {
  loadTutorial()
})
</script>

<template>
  <div class="tutorial-view">
    <div class="lang-switch">
      <button :class="{ active: currentLang === 'zh' }" @click="switchLang('zh')">中文</button>
      <button :class="{ active: currentLang === 'en' }" @click="switchLang('en')">English</button>
    </div>
    <div ref="markdownBody" class="markdown-body" v-html="renderedContent"></div>
  </div>
</template>

<style scoped>
.tutorial-view {
  padding: 40px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  height: 100vh;
  background: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  /* Glowing border and card shadow */
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(15, 23, 42, 0.08);
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s;
  scroll-behavior: smooth;
}

.lang-switch {
  position: absolute;
  top: 80px; /* Move down from 32px to 80px */
  right: 48px;
  z-index: 10;
  display: flex;
  gap: 12px;
}
.lang-switch button {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 18px;
  font-size: 1em;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}
.lang-switch button.active,
.lang-switch button:hover {
  background: #2563eb;
  color: #fff;
  border: 1px solid #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.20);
}

:deep(.markdown-body) {
  max-width: 980px;
  margin: 0 auto;
  color: #213547;
  font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', 'monospace', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.7;
  letter-spacing: 0.01em;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 16px 0 rgba(15, 23, 42, 0.04);
  padding: 32px 36px 32px 36px;
  border: 1px solid #e2e8f0;
  backdrop-filter: none;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 700;
  line-height: 1.25;
  color: #2563eb;
  text-shadow: none;
  letter-spacing: 0.02em;
  scroll-margin-top: 20px; /* Offset for hash scroll target */
  transition: background 0.3s ease;
}

/* Highlight targeted heading */
:deep(.markdown-body h1:target),
:deep(.markdown-body h2:target),
:deep(.markdown-body h3:target),
:deep(.markdown-body h4:target),
:deep(.markdown-body h5:target),
:deep(.markdown-body h6:target) {
  background: rgba(0, 234, 255, 0.15);
  padding: 8px 12px;
  margin-left: -12px;
  margin-right: -12px;
  border-radius: 6px;
  box-shadow: 0 0 16px rgba(0, 234, 255, 0.3);
}

:deep(.markdown-body h1) { font-size: 2.2em; border-bottom: 1px solid #00eaff33; padding-bottom: 0.3em; }
:deep(.markdown-body h2) { font-size: 1.6em; border-bottom: 1px solid #00eaff22; padding-bottom: 0.3em; }
:deep(.markdown-body h3) { font-size: 1.3em; }

:deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 16px;
  color: #4b5563;
  font-size: 1.08em;
}

:deep(.markdown-body a) {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px dashed rgba(37, 99, 235, 0.6);
  transition: color 0.2s, border-bottom 0.2s;
}
:deep(.markdown-body a:hover) {
  color: #1d4ed8;
  border-bottom: 1px solid #1d4ed8;
  text-shadow: none;
}
/* 标题前的 # 锚点、目录列表项统一蓝色 */
:deep(.markdown-body .header-anchor) {
  color: #2563eb;
}
:deep(.markdown-body ol li),
:deep(.markdown-body ul li) {
  color: #2563eb;
}
:deep(.markdown-body ol li a),
:deep(.markdown-body ul li a) {
  color: #2563eb;
}

:deep(.markdown-body img) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  border-radius: 10px;
  border: 1.5px solid #00eaff33;
  box-shadow: 0 2px 16px 0 #00eaff22;
  margin: 16px 0;
  transition: box-shadow 0.2s;
}
:deep(.markdown-body img:hover) {
  box-shadow: 0 0 24px 2px #00eaff88;
}

:deep(.markdown-body video) {
  max-width: 100%;
  border-radius: 10px;
  border: 1.5px solid #00eaff33;
  margin-bottom: 16px;
  box-shadow: 0 2px 16px 0 #00eaff22;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.5em;
  margin: 0;
  font-size: 90%;
  background: #f3f4f6;
  border-radius: 6px;
  color: #2563eb;
  font-family: 'JetBrains Mono', 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', 'monospace';
  border: 1px solid #d1d5db;
  box-shadow: none;
}

:deep(.markdown-body pre) {
  padding: 18px 20px;
  overflow: auto;
  font-size: 95%;
  line-height: 1.55;
  background: #f3f4f6;
  border-radius: 10px;
  margin-bottom: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: none;
  position: relative;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

:deep(.markdown-body pre code) {
  display: inline;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background: transparent;
  border: 0;
  color: #2563eb;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

:deep(.markdown-body pre.has-copy-button) {
  padding-top: 44px;
}

:deep(.markdown-body .copy-code-btn) {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.10);
}

:deep(.markdown-body .copy-code-btn:hover) {
  background: #2563eb;
  color: #fff;
  border: 1px solid #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.20);
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: #8bffe6;
  border-left: 0.25em solid #00eaff99;
  margin: 0 0 16px 0;
  background: rgba(0,234,255,0.04);
  border-radius: 6px;
}

:deep(.markdown-body hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background: linear-gradient(90deg, #00eaff33 0%, #232526 100%);
  border: 0;
  border-radius: 2px;
}

:deep(.markdown-body table) {
  border-spacing: 0;
  border-collapse: collapse;
  margin-top: 0;
  margin-bottom: 16px;
  width: 100%;
  overflow: auto;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  padding: 8px 15px;
  border: 1px solid #e5e7eb;
  color: #374151;
}

:deep(.markdown-body table th) {
  font-weight: 700;
  background: #eff6ff;
  color: #1e40af;
}

:deep(.markdown-body table tr) {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

:deep(.markdown-body table tr:nth-child(2n)) {
  background: #f9fafb;
}

/* Custom Scrollbar */
.tutorial-view::-webkit-scrollbar {
  width: 10px;
  background: #232526;
}
.tutorial-view::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00eaff 0%, #232526 100%);
  border-radius: 8px;
}

:deep(.markdown-body::-webkit-scrollbar) {
  height: 8px;
  background: #232526;
}
:deep(.markdown-body::-webkit-scrollbar-thumb) {
  background: linear-gradient(90deg, #00eaff 0%, #232526 100%);
  border-radius: 8px;
}
</style>
