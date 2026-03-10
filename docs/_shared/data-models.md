# 공통 데이터 모델

기획 단계에서 정의하는 개념 모델이다. 실제 DB 스키마와 API 응답은 각 직군이 결정한다.

## 사용자

### Host (게스트하우스 오너)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| phone | string | 전화번호 |
| name | string | 이름 |
| socialProvider | 'kakao' \| 'naver' \| 'apple' \| null | 소셜 로그인 제공자 |
| guesthouseId | string | 소유한 게스트하우스 ID |

### Staff (직원)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| phone | string | 전화번호 |
| name | string | 이름 |
| socialProvider | 'kakao' \| 'naver' \| 'apple' \| null | 소셜 로그인 제공자 |
| guesthouseId | string | 소속 게스트하우스 ID |
| invitedBy | string | 초대한 host ID |

## 게스트하우스

### Guesthouse
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| name | string | 게스트하우스 이름 |
| description | string | 설명 |
| address | string | 주소 |
| phone | string | 대표 전화번호 |
| email | string | 이메일 |
| website | string \| null | 웹사이트 (선택) |
| dinnerParty | IDinnerParty | 파티 방식 |
| rooms | IRoom[] | 방 목록 |

### IDinnerParty
`'POT_LUCK' | 'HOST_SERVED' | 'CUSTOM'`

### IRoom
| 필드 | 타입 | 설명 |
|------|------|------|
| capacity | number | 수용 인원 (1-4) |
| gender | IGender | 성별 제한 |
| name | string | 방 이름 (선택) |
| hasBathroom | boolean | 개인 화장실 여부 |

### IGender
`'male' | 'female' | 'regardless'`

## 게스트

### Guest
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| name | string | 이름 |
| phone | string | 전화번호 |
| expectedArrivalTime | string | 도착 예상 시간 (HH:mm) |
| checkedIn | boolean | 체크인 여부 |
| partyAttending | boolean | 파티 참가 여부 |
| memo | string \| null | 내부 메모 |
| roomId | string | 배정 방 ID |
| checkInDate | string | 체크인 날짜 (YYYY-MM-DD) |
| checkOutDate | string | 체크아웃 날짜 (YYYY-MM-DD) |

## 공유사항

### Announcement
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| content | string | 내용 |
| authorId | string | 작성자 ID (host 또는 staff) |
| createdAt | string | 작성 시간 |

## 스케줄

### StaffSchedule
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| staffId | string | 스탭 ID |
| date | string | 근무 날짜 (YYYY-MM-DD) |

## 채팅

### ChatRoom
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| guestId | string | 게스트 ID |
| guesthouseId | string | 게스트하우스 ID |
| lastMessage | string | 마지막 메시지 미리보기 |
| lastMessageAt | string | 마지막 메시지 시간 |
| unreadCount | number | 읽지 않은 메시지 수 |

### ChatMessage
| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 고유 식별자 |
| chatRoomId | string | 채팅방 ID |
| senderId | string | 발신자 ID |
| senderType | 'guest' \| 'host' \| 'staff' | 발신자 역할 |
| content | string | 메시지 내용 |
| createdAt | string | 전송 시간 |
