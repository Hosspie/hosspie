---
title: 네이티브 코드 프로파일링
impact: MEDIUM
tags: xcode, instruments, android-studio, profiler
---

# Skill: 네이티브 코드 프로파일링

Xcode Instruments와 Android Studio Profiler를 사용하여 네이티브 성능 병목 지점을 식별합니다.

## 빠른 명령어

```bash
# iOS: Instruments 열기
# Xcode → Open Developer Tool → Instruments → Time Profiler

# Android: Profiler 열기
# Android Studio → View → Tool Windows → Profiler
```

## 언제 사용하나요

- 앱이 느린데 JS 프로파일러에서 문제 없음
- 네이티브 모듈 성능 조사
- 시작이 느리게 느껴짐 (네이티브 초기화)
- 배터리 소모 우려
- 스레드별 CPU/메모리 분석 필요

> **참고**: 이 스킬은 시각적 프로파일러 출력(Xcode Instruments, Android Studio Profiler) 해석이 필요합니다. AI 에이전트는 아직 스크린샷을 자동으로 처리할 수 없습니다. 프로파일러 UI를 직접 검토하면서 이 가이드를 참고하거나, MCP 기반 시각적 피드백 통합을 기다려주세요(로드맵 참고).

## iOS Xcode 프로파일링

### 빠른 체크: Debug Navigator

1. Xcode를 통해 앱 실행
2. Debug Navigator (사이드 패널) 열기
3. 실시간 보기: CPU, Memory, Disk, Network

**CPU 퍼센트는 100%를 초과할 수 있음** (멀티코어 사용).

### 심층 프로파일링: Instruments

1. 열기: **Xcode → Open Developer Tool → Instruments**
2. **Time Profiler** 선택
3. 대상 기기와 앱 선택
4. 기록 클릭 (빨간 원)
5. 앱에서 동작 수행
6. 기록 중지

### Time Profiler 결과 분석

**주요 뷰:**
- **Flame Graph**: 시간에 따른 시각적 호출 스택
- **Call Tree**: 계층적 함수 분석
- **Ranked**: 시간별로 정렬된 함수 (Bottom-Up)

**유용한 필터:**
- Hide System Libraries
- Invert Call Tree (상향식 뷰)
- 스레드별 필터 (main, JS 등)

**문제 식별:**
- **Microhang**: 짧은 UI 무응답
- **Hang**: 완전한 UI 스레드 블록 (심각)
- 노란색 = 가장 많은 시간 소요

### 스레드 분석

비교를 위해 스레드 고정:
- **Main thread** (SampleApp): UI 렌더링
- **JavaScript thread**: React/JS 실행
- **Background threads**: 네이티브 모듈

**프로 팁**: JS 스레드 블록 ≠ UI 블록 (React Native 디자인 이점).

## Android Android Studio 프로파일링

### 프로파일러 실행

1. **View → Tool Windows → Profiler**
2. 또는: 툴바에서 "Profile" 클릭

### CPU 프로파일링

1. **"Find CPU Hotspots"** 선택
2. **"Start profiler task"** 클릭
3. 앱과 상호작용
4. 분석을 위해 중지

### 결과 분석

**Flame Graph:**
- 스크롤/핀치로 줌
- 호출 스택 확장하려면 클릭
- 키워드로 필터 (예: "hermes")

**뷰:**
- **Top Down**: 진입점부터 아래로
- **Bottom Up**: 가장 느린 함수부터 위로
- **Flame Chart**: 타임라인 시각화

### 호출 스택 읽기

예제 분석:
```
버튼 누른 후 JS 스레드 활동:
- 메인 스레드의 이벤트 핸들러
- 동기 JSI 호출을 통해 JS 작업 트리거
- Hermes가 React reconciliation 처리
- "commit" 단계에서 약 30% 시간 (Yoga 레이아웃)
```

## 코드 예제: 찾아야 할 것

### ScrollView의 5000개 View (나쁨)

프로파일러 표시:
- 240ms+ JS 스레드 작업
- 많은 1ms Hermes 스파이크
- 16.6ms 프레임 예산 초과
- 결과: 프레임 드롭, UI jank

### FlatList 사용 (더 좋음)

프로파일러 표시:
- 최소 JS 작업 (윈도우 렌더링)
- 부드러운 메인 스레드
- 프레임 예산 내 유지

## 플랫폼 도구 요약

| 도구 | 플랫폼 | 사용 사례 |
|------|----------|----------|
| Time Profiler | iOS | CPU 핫스팟 |
| Leaks | iOS | 메모리 누수 |
| Hangs | iOS | UI 스레드 블록 |
| CPU Profiler | Android | CPU 핫스팟 |
| Memory Profiler | Android | 메모리 추적 |
| Perfetto | Android | 고급 추적 분석 |

## Perfetto (고급 Android)

Android Studio에서 추적을 내보내서 [ui.perfetto.dev](https://ui.perfetto.dev/)에서 분석:

- 교차 프로세스 분석
- 커스텀 추적 이벤트
- 추가 시각화

## 프로 팁

1. **저사양 기기에서 프로파일링**: 문제가 더 명확하게 나타남
2. **릴리스 빌드 사용**: 디버그 빌드는 오버헤드 있음
3. **전/후 비교**: 비교를 위해 추적 내보내기
4. **스레드별 필터**: 관련 작업에 집중
5. **패턴 찾기**: 상호작용과 관련된 스파이크

## Expo 참고사항

- **Expo Go**: 네이티브 코드를 직접 프로파일링할 수 없음; JS 프로파일링만
- **Dev Client / Prebuild**: Xcode/Android Studio를 통한 전체 네이티브 프로파일링 지원
- `npx expo prebuild` 실행하여 네이티브 프로젝트 생성 후 일반 React Native로 프로파일링

## 일반적인 발견

| 증상 | 가능한 원인 |
|---------|--------------|
| 메인 스레드 행 | 무거운 UI 작업, 블록된 작업 |
| JS 스레드 스파이크 | React 리렌더링, 무거운 연산 |
| 백그라운드 스레드 바쁨 | 네이티브 모듈 작업 |
| 메모리 증가 | 누수 (메모리 프로파일링 스킬 참고) |

## 관련 스킬

- [native-measure-tti.md](./native-measure-tti.md) - 시작 전용 프로파일링
- [native-memory-leaks.md](./native-memory-leaks.md) - 메모리 프로파일링
- [js-profile-react.md](./js-profile-react.md) - JS/React 프로파일링
