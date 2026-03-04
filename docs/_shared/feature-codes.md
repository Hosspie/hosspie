# 기능 코드 목록

## 코드 규칙

```
형식: {도메인}-{스크린}-{번호}
테스트: {기능코드}-T{번호}
```

## 도메인 접두어

| 접두어 | 도메인 | 설명 |
|--------|--------|------|
| AUTH | 인증 | 로그인, 회원가입 |
| OBD | 온보딩 | 게스트하우스 최초 등록 |
| HOME | 홈 | 메인 대시보드 |
| CHK | 체크인 | 게스트 체크인 관리 |
| SCH | 스케줄 | 스탭 근무 관리 |
| CHAT | 채팅 | 게스트-게스트하우스 1:1 채팅 |
| PROF | 프로필 | 프로필 조회/수정 |
| GRST | 게스트 등록 | 게스트 수동 등록 |

## 전체 기능 코드

### AUTH (인증)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| AUTH-SIGNIN-001 | 전화번호 OTP 인증 | signin.md |
| AUTH-SIGNIN-002 | 카카오 소셜 로그인 | signin.md |
| AUTH-SIGNIN-003 | 네이버 소셜 로그인 | signin.md |
| AUTH-SIGNIN-004 | 애플 소셜 로그인 | signin.md |

### OBD (온보딩)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| OBD-DESC-001 | 게스트하우스 이름 입력 | onboarding/description.md |
| OBD-DESC-002 | 게스트하우스 설명 입력 | onboarding/description.md |
| OBD-INFO-001 | 주소 입력 | onboarding/information.md |
| OBD-INFO-002 | 전화번호 입력 | onboarding/information.md |
| OBD-INFO-003 | 이메일 입력 | onboarding/information.md |
| OBD-INFO-004 | 웹사이트 입력 | onboarding/information.md |
| OBD-PARTY-001 | 파티 방식 선택 | onboarding/dinner-party.md |
| OBD-ROOMS-001 | 방 추가 | onboarding/rooms.md |
| OBD-ROOMS-002 | 방 삭제 | onboarding/rooms.md |
| OBD-ROOMS-003 | 온보딩 완료 | onboarding/rooms.md |

### HOME (홈)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| HOME-DASH-001 | 공유사항 조회 | (tabs)/index.md |
| HOME-DASH-002 | 공유사항 작성 | (tabs)/index.md |
| HOME-DASH-003 | 체크인 현황 요약 | (tabs)/index.md |
| HOME-DASH-004 | 이번주 스탭 근무표 요약 | (tabs)/index.md |
| HOME-DASH-005 | 게스트 등록 유도 | (tabs)/index.md |

### CHK (체크인)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| CHK-LIST-001 | 게스트 목록 조회 | (tabs)/check-in.md |
| CHK-LIST-002 | 체크인 상태 토글 | (tabs)/check-in.md |
| CHK-LIST-003 | 게스트 메모 등록 | (tabs)/check-in.md |
| CHK-LIST-004 | 개인 SMS 발송 | (tabs)/check-in.md |
| CHK-LIST-005 | 파티 참가 여부 표시 | (tabs)/check-in.md |

### SCH (스케줄)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| SCH-WEEK-001 | 이번주 스탭 근무 조회 | (tabs)/schedule.md |
| SCH-WEEK-002 | 스탭 근무 등록/수정 | (tabs)/schedule.md |
| SCH-WEEK-003 | 스탭 초대 (딥링크) | (tabs)/schedule.md |

### CHAT (채팅)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| CHAT-CONV-001 | 채팅 목록 조회 | (tabs)/chat.md |
| CHAT-CONV-002 | 메시지 전송 | (tabs)/chat.md |
| CHAT-CONV-003 | 메시지 실시간 수신 | (tabs)/chat.md |

### PROF (프로필)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| PROF-EDIT-001 | host 프로필 수정 | edit-profile.md |
| PROF-EDIT-002 | staff 프로필 수정 | edit-profile.md |

### GRST (게스트 등록)
| 코드 | 기능명 | 스크린 |
|------|--------|--------|
| GRST-REG-001 | 게스트 수동 등록 | register-guests.md |
| GRST-REG-002 | 안내 SMS 일괄 발송 | register-guests.md |
