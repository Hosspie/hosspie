---
paths:
  - ".claude/**"
---

# `.claude/` 문서 구조

## 역할 분리

- **`.claude/rules/`** — 코드 린트·컨벤션·템플릿. path 매칭 시 자동 로드. 폴더: `front/` `backend/` `publishing/` `docs/`. 모든 코드 룰은 여기.
- **`.claude/agents/`** — sub-agent 정의. 역할·스택·도구·협업·rule pointer 만. **lint·template 금지** (rules 가 자동 적용되므로 중복 불필요).
- **`.claude/skills/`** — 워크플로우 패키지 (`code-review`·`update-milestones` 등). 코드 린트 금지.

## 새 룰 추가 시

- 코드 컨벤션·패턴·템플릿 → `.claude/rules/<domain>/` 의 적절한 파일.
- agent / skill 작성·수정 시 lint·template 줄이 들어가면 멈추고 rules 로 빼기.
- agent 마지막엔 "구체 컨벤션은 `.claude/rules/<domain>/` 자동 적용" pointer 한 줄.
