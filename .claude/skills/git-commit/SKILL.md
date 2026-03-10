---
name: git-commit
description: 변경사항을 분석하여 자동으로 commit 메시지를 생성하고 커밋합니다. 한글 커밋 메시지 지원.
allowed-tools: Bash, Read, Glob, Grep
---

# 커밋 스킬

변경사항을 분석하여 의미있는 커밋 메시지를 자동 생성합니다.

## 실행 절차

### 1. 변경사항 분석

다음 명령어를 **병렬로** 실행하여 변경사항을 파악합니다:

```bash
# 상태 확인
git status

# staged + unstaged 변경사항
git diff HEAD

# 최근 커밋 스타일 참조 (5개)
git log --oneline -5
```

### 2. 커밋 메시지 생성

변경사항을 분석하여 다음 형식의 커밋 메시지를 생성합니다:

```
<type>: <subject>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>
```

#### Type 규칙

| Type       | 용도                           |
| ---------- | ------------------------------ |
| `feat`     | 새로운 기능 추가               |
| `fix`      | 버그 수정                      |
| `refactor` | 코드 리팩토링 (기능 변경 없음) |
| `style`    | 코드 스타일 변경 (포맷팅 등)   |
| `test`     | 테스트 추가/수정               |
| `docs`     | 문서 수정                      |
| `chore`    | 빌드, 설정 파일 변경           |

#### 메시지 작성 규칙

- **반드시 한글**로 작성
- Subject는 50자 이내
- Body는 "왜(why)" 변경했는지 설명
- 여러 변경사항이 있으면 bullet point로 정리

### 3. 커밋 실행

사용자에게 생성된 메시지를 보여주고 확인 후 커밋합니다:

```bash
git add -A
git commit -m "$(cat <<'EOF'
<생성된 커밋 메시지>

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 4. 결과 확인

```bash
git status
git log -1
```

## 예시

### 입력

```
/commit
```

### 출력

```
## 변경사항 분석

- stores/therapyInfoStore.ts: 테라피 타입 enum 추가
- hooks/useAuth.ts: 로그아웃 로직 개선
- __tests__/therapyInfoStore.test.ts: 신규 테스트 케이스 추가

## 제안 커밋 메시지

feat: 테라피 타입 enum 추가 및 인증 로직 개선

- therapyInfoStore에 테라피 타입 enum 정의
- useAuth 훅의 로그아웃 시 상태 초기화 개선
- therapyInfoStore 테스트 케이스 추가

이 메시지로 커밋할까요? (y/n)
```

## 주의사항

- **커밋 메시지는 반드시 한글로 작성** (type 제외)
- **subject는 소문자로 시작** (commitlint의 subject-case 규칙)
  - ✅ 올바른 예: `test: 테스트 인프라 구축`, `docs: pr 스킬 문서 개선`
  - ❌ 잘못된 예: `test: 테스트 인프라 구축` (첫 한글 자는 허용), `docs: PR 스킬 문서 개선` (영문 대문자 불가)
  - commitlint 오류 발생 시 subject의 영문 대문자를 소문자로 수정하여 재시도
- `.env`, `credentials.json` 등 민감한 파일이 포함되어 있으면 **경고**
- 변경사항이 없으면 커밋하지 않음
- **pre-commit hook 실행**: 커밋 시 lint, 타입 체크 등 pre-commit hook이 실행됩니다
