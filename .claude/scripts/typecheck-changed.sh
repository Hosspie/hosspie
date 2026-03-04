#!/bin/bash
# Stop 훅: 변경된 TS/TSX 파일이 속한 패키지에서 tsc --noEmit 실행

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
if [ -z "$PROJECT_DIR" ]; then exit 0; fi
cd "$PROJECT_DIR"

# 변경된 TS/TSX 파일 목록 (unstaged)
CHANGED_TS=$(git diff --name-only 2>/dev/null | grep -E '\.(ts|tsx)$')
if [ -z "$CHANGED_TS" ]; then exit 0; fi

# 변경된 패키지 경로 추출 (중복 제거)
# packages/services/frontend 같은 깊은 경로도 처리
PACKAGES=$(echo "$CHANGED_TS" | sed -E \
  -e 's|^(apps/[^/]+)/.*|\1|' \
  -e 's|^(packages/services/[^/]+)/.*|\1|' \
  -e 's|^(packages/[^/]+)/.*|\1|' \
  | sort -u)

if [ -z "$PACKAGES" ]; then exit 0; fi

HAS_ERROR=0
ALL_OUTPUT=""

while IFS= read -r pkg; do
  if [ -f "$PROJECT_DIR/$pkg/tsconfig.json" ]; then
    OUTPUT=$(cd "$PROJECT_DIR/$pkg" && npx tsc --noEmit 2>&1)
    if [ $? -ne 0 ]; then
      HAS_ERROR=1
      ALL_OUTPUT+="
=== Type Error: $pkg ===
$OUTPUT
"
    fi
  fi
done <<< "$PACKAGES"

if [ $HAS_ERROR -ne 0 ]; then
  echo "$ALL_OUTPUT" >&2
  exit 2
fi

exit 0
