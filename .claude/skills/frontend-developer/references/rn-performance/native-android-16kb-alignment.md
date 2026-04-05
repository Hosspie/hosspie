---
title: Android 16 KB 페이지 크기 정렬
impact: CRITICAL
tags: android, native, 16kb, alignment, page-size, google-play, third-party
---

# Android 16 KB 페이지 크기 정렬

---

## 빠른 참조

| 항목                   | 세부사항                                              |
| ---------------------- | ---------------------------------------------------- |
| Google Play 마감일   | Android 15+ 타겟팅 앱의 경우 2025년 11월 1일      |
| React Native 지원   | React Native 0.79부터 내장 지원                     |
| 확인 대상          | 서드파티 네이티브 라이브러리 (`.so` 파일)           |
| 공식 문서 | [developer.android.com/guide/practices/page-sizes][] |

[developer.android.com/guide/practices/page-sizes]: https://developer.android.com/guide/practices/page-sizes

---

## 빠른 명령어

Android 공식 `zipalign` 도구를 사용하여 APK 정렬 확인:

```bash
zipalign -c -P 16 -v 4 app-release.apk
```

64비트 라이브러리(`arm64-v8a`, `x86_64`)가 정렬 오류를 보이면 업데이트가 필요합니다.

더 깊은 ELF 레벨 검사를 위해서는 Android의 [check_elf_alignment.sh][] 스크립트를 사용하세요.

[check_elf_alignment.sh]: https://cs.android.com/android/platform/superproject/main/+/main:system/extras/tools/check_elf_alignment.sh

---

## 언제 확인하나요

React Native 0.79+는 올바른 정렬로 코어 바이너리를 빌드합니다. 하지만 **서드파티 네이티브 라이브러리**는 여전히 정렬이 안 맞을 수 있습니다. 다음 경우 정렬을 확인하세요:

* 네이티브 코드가 있는 SDK를 추가하거나 업데이트할 때
* Google Play 릴리스 준비 시
* 16 KB 페이지 크기를 가진 Android 15+ 기기에서 크래시 조사 시

---

## CI 통합

릴리스 파이프라인에 정렬 체크를 추가하여 제출 전 문제를 잡습니다. 예제:

```bash
zipalign -c -P 16 -v 4 app-release.apk 2>&1 | tee alignment.log
if grep -q "Verification FAILED" alignment.log; then exit 1; fi
```

## 단계별

1. 릴리스 APK 또는 AAB 빌드
2. `zipalign` 검증 실행 (빠른 명령어 참고)
3. 정렬 오류가 있는 라이브러리를 찾으면 소스 패키지 추적 (아래 참고)
4. 영향받는 의존성 업데이트, 교체 또는 제거

런타임 테스트는 [16KB Android Emulator 이미지][]를 사용하거나 Pixel 8/8a/9 기기에서 "Boot with 16KB page size"를 활성화하세요.

[16KB Android Emulator 이미지]: https://developer.android.com/guide/practices/page-sizes#set-up-the-android-emulator-with-a-16-kb-based-system-image

---

## 정렬 오류 라이브러리 추적

`zipalign`이 `libfoo.so`와 같은 정렬 오류 라이브러리를 보고하면 소스 패키지를 찾으세요:

```bash
# node_modules에서 .so 파일 찾기
find node_modules -name "libfoo.so" 2>/dev/null

# 또는 gradle 파일에서 참조 검색
grep -r "foo" node_modules/*/android --include="*.gradle" 2>/dev/null
```

식별 후 의존성을 업데이트하거나 16KB 호환 빌드를 위해 벤더에 문의하세요.

---

## 흔한 실수

* Play Store 거부를 기다리는 대신 CI에서 확인하지 않음
* React Native 업그레이드가 서드파티 네이티브 바이너리를 재빌드할 것으로 가정
* 32비트 ABI(`armeabi-v7a`, `x86`)만 확인 — 이들은 영향받지 않음
* `-P 16` 플래그 없이 `zipalign` 사용 (4 KB만 확인, 16 KB가 아님)
* 디버그 빌드만 검증

---

## 정렬 문제 수정

정렬 문제는 호환 툴체인으로 네이티브 라이브러리를 **재빌드**해야 합니다.
재패키징만으로는 수정되지 않습니다.

자세한 안내는 [공식 수정 단계][]를 참고하세요.

[공식 수정 단계]: https://developer.android.com/guide/practices/page-sizes#build-app-16kb

---

## 관련 스킬

* [native-profiling.md](./native-profiling.md) — 네이티브 디버깅 도구
