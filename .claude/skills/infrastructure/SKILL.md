---
name: infrastructure
description: Hosspie 프로젝트의 인프라 관련 규칙과 설정을 정의합니다. 브랜치 전략, 배포, CI/CD, 환경 설정 등 인프라 관련 작업 시 참조. 트리거: 브랜치 생성/삭제, PR 생성, 배포, CI/CD 파이프라인, 환경 설정, 인프라 관련 의사결정.
---

# Infrastructure

## 브랜치 전략

**Trunk-Based Development** 방식을 사용합니다.

- **`main`** 브랜치가 유일한 장기 브랜치 (trunk)
- `dev` 브랜치 없음 — 모든 feature 브랜치는 `main`에서 분기하고 `main`으로 병합
- feature 브랜치는 짧은 수명 유지 (가능한 빨리 main에 병합)
