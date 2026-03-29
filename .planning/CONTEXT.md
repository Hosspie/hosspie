# 구현 컨텍스트

## 전체 아키텍처 결정

### WebView 하이브리드 아키텍처
- Admin App의 화면은 WebView로 전달 (Vite + Tailwind CSS + Bridge)
- React Native는 네비게이션 쉘 + 네이티브 기능 (푸시 알림, SMS 등) 담당
- 화면 업데이트를 앱 빌드 없이 배포 가능

### 기존 구현물 활용
- 온보딩 플로우: React Native 네이티브 구현 유지 (이미 완성)
- 새 화면: WebView 하이브리드로 구현
- 디자인 시스템: Atom/Organism은 RN용, Web 화면은 Tailwind CSS

---

## Phase별 컨텍스트

(각 Phase discuss 시 업데이트)
