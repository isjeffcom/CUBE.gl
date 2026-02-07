# Changelog

## [2.0.0] - 2026-02-07

### ⚠ BREAKING CHANGES

- **Three.js** 从 `v0.129` 升级到 `v0.170`，移除了所有已废弃的 API
- **构建工具** 从 Parcel v1 迁移到 Vite 6，输出格式变更
- **模块系统** 改为 ESM（`"type": "module"`）
- **输出文件** 变更：
  - UMD: `dist/cubegl.js` → `dist/cubegl.umd.js`
  - 新增 ES Module: `dist/cubegl.es.js`
- **CDN 用法变更**:
  ```html
  <!-- 旧 -->
  <script src="https://unpkg.com/cube.gl@1/dist/cubegl.js"></script>
  <!-- 新 -->
  <script src="https://unpkg.com/cube.gl@2/dist/cubegl.umd.js"></script>
  ```

### 升级指南

如果你在项目中直接使用了 Three.js API（通过 `CUBE.Space.three`），请注意以下变更：

| 旧 API | 新 API |
|--------|--------|
| `THREE.Geometry()` | `THREE.BufferGeometry()` |
| `THREE.Math.degToRad()` | `THREE.MathUtils.degToRad()` |
| `THREE.BoxBufferGeometry` | `THREE.BoxGeometry` |
| `THREE.SphereBufferGeometry` | `THREE.SphereGeometry` |
| `THREE.CylinderBufferGeometry` | `THREE.CylinderGeometry` |
| `THREE.PlaneBufferGeometry` | `THREE.PlaneGeometry` |
| `THREE.ExtrudeBufferGeometry` | `THREE.ExtrudeGeometry` |
| `THREE.FontLoader` | `import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'` |
| `THREE.TextBufferGeometry` | `import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'` |
| `geometry.vertices` | `geometry.getAttribute('position')` |

### Changed

- Three.js 升级到 v0.170
- @tweenjs/tween.js 升级到 v23
- osmtogeojson 升级到 v3
- geotiff 改为正式 npm 依赖（替代内嵌 Parcel bundle）
- deepmerge 升级到 v4.3
- geolib 升级到 v3.3.4
- 构建工具从 Parcel v1 迁移到 Vite 6
- Playground 示例全部迁移为 ES Module 格式
- 浏览器兼容性目标更新

### Removed

- 移除 Babel 相关依赖（Vite 内置转译）
- 移除 Parcel 相关依赖和插件
- 移除对 IE 11 的兼容性排除（已无需考虑）

### Fixed

- 修复 `WorldCoordinate` 未导出的问题
- 修复 `osmtogeojson` 错误的命名导入
- WASM 加载增加错误处理和降级机制
