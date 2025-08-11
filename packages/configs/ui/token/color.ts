'use client';
import { vars } from 'nativewind';

export const colorConfig = {
  dark: vars({
    /* Primary Brand - Orange */
    '--color-primary-0': '255 244 235', // 매우 연한 오렌지
    '--color-primary-50': '255 230 204', // 연한 오렌지
    '--color-primary-100': '255 216 173', // 밝은 오렌지
    '--color-primary-200': '255 186 122', // 중간 밝은 오렌지
    '--color-primary-300': '255 156 71', // 중간 오렌지
    '--color-primary-400': '255 126 20', // 기본 오렌지
    '--color-primary-500': '255 107 53', // 메인 브랜드 오렌지 (사진의 주요 색상)
    '--color-primary-600': '230 95 48', // 진한 오렌지
    '--color-primary-700': '204 84 42', // 더 진한 오렌지
    '--color-primary-800': '153 63 32', // 매우 진한 오렌지
    '--color-primary-900': '102 42 21', // 가장 진한 오렌지
    '--color-primary-950': '76 32 16', // 거의 브라운

    /* Secondary - Dark Grays (카드 배경색) */
    '--color-secondary-0': '15 15 15', // 가장 어두운 배경
    '--color-secondary-50': '20 20 20', // 매우 어두운 배경
    '--color-secondary-100': '30 30 30', // 어두운 배경
    '--color-secondary-200': '40 40 40', // 카드 배경 (사진의 어두운 카드들)
    '--color-secondary-300': '50 50 50', // 중간 어두운 배경
    '--color-secondary-400': '60 60 60', // 중간 배경
    '--color-secondary-500': '75 75 75', // 밝은 회색
    '--color-secondary-600': '90 90 90', // 더 밝은 회색
    '--color-secondary-700': '110 110 110', // 연한 회색
    '--color-secondary-800': '140 140 140', // 밝은 회색
    '--color-secondary-900': '180 180 180', // 매우 밝은 회색
    '--color-secondary-950': '220 220 220', // 거의 화이트

    /* Tertiary - Brown/Gold Accent (사진의 브라운 계열) */
    '--color-tertiary-0': '41 31 20', // 어두운 브라운
    '--color-tertiary-50': '51 38 25', // 진한 브라운
    '--color-tertiary-100': '71 54 35', // 브라운
    '--color-tertiary-200': '102 77 50', // 중간 브라운
    '--color-tertiary-300': '133 101 66', // 밝은 브라운
    '--color-tertiary-400': '164 124 81', // 골드 브라운
    '--color-tertiary-500': '195 148 97', // 라이트 골드
    '--color-tertiary-600': '215 168 117', // 밝은 골드
    '--color-tertiary-700': '235 188 137', // 연한 골드
    '--color-tertiary-800': '245 208 167', // 매우 연한 골드
    '--color-tertiary-900': '250 228 197', // 거의 베이지
    '--color-tertiary-950': '253 238 217', // 베이지

    /* Error - Red (다크 테마용) */
    '--color-error-0': '60 15 15', // 어두운 빨강
    '--color-error-50': '80 20 20', // 진한 빨강
    '--color-error-100': '120 30 30', // 빨강
    '--color-error-200': '160 40 40', // 중간 빨강
    '--color-error-300': '200 50 50', // 밝은 빨강
    '--color-error-400': '230 60 60', // 더 밝은 빨강
    '--color-error-500': '255 75 75', // 메인 에러 빨강
    '--color-error-600': '255 100 100', // 연한 빨강
    '--color-error-700': '255 130 130', // 더 연한 빨강
    '--color-error-800': '255 160 160', // 매우 연한 빨강
    '--color-error-900': '255 190 190', // 거의 핑크
    '--color-error-950': '255 220 220', // 핑크

    /* Success - Green (다크 테마용) */
    '--color-success-0': '15 40 25', // 어두운 초록
    '--color-success-50': '20 50 30', // 진한 초록
    '--color-success-100': '30 70 40', // 초록
    '--color-success-200': '40 90 50', // 중간 초록
    '--color-success-300': '50 110 65', // 밝은 초록
    '--color-success-400': '60 130 80', // 더 밝은 초록
    '--color-success-500': '75 150 95', // 메인 성공 초록
    '--color-success-600': '100 170 120', // 연한 초록
    '--color-success-700': '130 190 150', // 더 연한 초록
    '--color-success-800': '160 210 180', // 매우 연한 초록
    '--color-success-900': '190 230 210', // 거의 민트
    '--color-success-950': '220 245 235', // 민트

    /* Warning - Yellow/Orange (다크 테마용) */
    '--color-warning-0': '50 35 10', // 어두운 노랑
    '--color-warning-50': '70 45 15', // 진한 노랑
    '--color-warning-100': '90 60 20', // 노랑
    '--color-warning-200': '120 80 25', // 중간 노랑
    '--color-warning-300': '150 100 35', // 밝은 노랑
    '--color-warning-400': '180 120 45', // 더 밝은 노랑
    '--color-warning-500': '210 150 60', // 메인 경고 노랑
    '--color-warning-600': '230 170 80', // 연한 노랑
    '--color-warning-700': '240 190 100', // 더 연한 노랑
    '--color-warning-800': '250 210 130', // 매우 연한 노랑
    '--color-warning-900': '255 230 160', // 거의 크림
    '--color-warning-950': '255 245 190', // 크림

    /* Info - Blue (다크 테마용) */
    '--color-info-0': '10 25 45', // 어두운 파랑
    '--color-info-50': '15 35 60', // 진한 파랑
    '--color-info-100': '20 50 80', // 파랑
    '--color-info-200': '30 70 110', // 중간 파랑
    '--color-info-300': '40 90 140', // 밝은 파랑
    '--color-info-400': '50 110 170', // 더 밝은 파랑
    '--color-info-500': '70 130 200', // 메인 정보 파랑
    '--color-info-600': '90 150 220', // 연한 파랑
    '--color-info-700': '120 170 235', // 더 연한 파랑
    '--color-info-800': '150 190 245', // 매우 연한 파랑
    '--color-info-900': '180 210 250', // 거의 하늘색
    '--color-info-950': '210 230 255', // 하늘색

    /* Typography - Dark Theme Text (사진의 텍스트 색상들) */
    '--color-typography-0': '255 255 255', // 순백색 (주요 제목)
    '--color-typography-50': '250 250 250', // 거의 화이트 (메인 텍스트)
    '--color-typography-100': '240 240 240', // 연한 회색 (서브 텍스트)
    '--color-typography-200': '220 220 220', // 밝은 회색 (라벨)
    '--color-typography-300': '200 200 200', // 중간 밝은 회색
    '--color-typography-400': '180 180 180', // 중간 회색 (보조 텍스트)
    '--color-typography-500': '160 160 160', // 회색 (비활성 텍스트)
    '--color-typography-600': '140 140 140', // 어두운 회색
    '--color-typography-700': '120 120 120', // 진한 회색
    '--color-typography-800': '100 100 100', // 매우 진한 회색
    '--color-typography-900': '80 80 80', // 거의 검은 회색
    '--color-typography-950': '60 60 60', // 검은 회색

    /* Outline - Dark Theme Borders */
    '--color-outline-0': '80 80 80', // 밝은 보더
    '--color-outline-50': '70 70 70', // 중간 밝은 보더
    '--color-outline-100': '60 60 60', // 중간 보더
    '--color-outline-200': '50 50 50', // 어두운 보더
    '--color-outline-300': '45 45 45', // 진한 보더
    '--color-outline-400': '40 40 40', // 매우 진한 보더
    '--color-outline-500': '35 35 35', // 카드 보더
    '--color-outline-600': '30 30 30', // 섹션 보더
    '--color-outline-700': '25 25 25', // 구분선
    '--color-outline-800': '20 20 20', // 어두운 구분선
    '--color-outline-900': '15 15 15', // 매우 어두운 구분선
    '--color-outline-950': '10 10 10', // 거의 검은 구분선

    /* Background - Dark Theme (사진의 배경색들) */
    '--color-background-0': '8 8 8', // 메인 배경 (가장 어두운)
    '--color-background-50': '12 12 12', // 앱 배경
    '--color-background-100': '18 18 18', // 컨텐츠 배경
    '--color-background-200': '25 25 25', // 카드 배경 (사진의 어두운 카드들)
    '--color-background-300': '35 35 35', // 액티브 카드 배경
    '--color-background-400': '45 45 45', // 호버 배경
    '--color-background-500': '55 55 55', // 선택된 배경
    '--color-background-600': '70 70 70', // 밝은 배경
    '--color-background-700': '90 90 90', // 더 밝은 배경
    '--color-background-800': '120 120 120', // 매우 밝은 배경
    '--color-background-900': '180 180 180', // 거의 화이트
    '--color-background-950': '240 240 240', // 화이트 배경

    /* Background Special - Dark Theme */
    '--color-background-error': '40 20 20', // 에러 배경 (어두운 빨강)
    '--color-background-warning': '45 35 15', // 경고 배경 (어두운 노랑)
    '--color-background-success': '20 35 25', // 성공 배경 (어두운 초록)
    '--color-background-muted': '30 30 30', // 뮤트 배경 (회색)
    '--color-background-info': '20 30 40', // 정보 배경 (어두운 파랑)

    /* Focus Ring Indicator - Dark Theme (포커스 표시용) */
    '--color-indicator-primary': '255 107 53', // 메인 오렌지 (포커스 링)
    '--color-indicator-info': '70 130 200', // 정보 파랑 (포커스 링)
    '--color-indicator-error': '255 75 75', // 에러 빨강 (포커스 링)
  }),
  light: vars({
    /* Primary Brand - Orange */
    '--color-primary-0': '255 244 235', // 매우 연한 오렌지
    '--color-primary-50': '255 230 204', // 연한 오렌지
    '--color-primary-100': '255 216 173', // 밝은 오렌지
    '--color-primary-200': '255 186 122', // 중간 밝은 오렌지
    '--color-primary-300': '255 156 71', // 중간 오렌지
    '--color-primary-400': '255 126 20', // 기본 오렌지
    '--color-primary-500': '255 107 53', // 메인 브랜드 오렌지 (사진의 주요 색상)
    '--color-primary-600': '230 95 48', // 진한 오렌지
    '--color-primary-700': '204 84 42', // 더 진한 오렌지
    '--color-primary-800': '153 63 32', // 매우 진한 오렌지
    '--color-primary-900': '102 42 21', // 가장 진한 오렌지
    '--color-primary-950': '76 32 16', // 거의 브라운

    /* Secondary - Dark Grays (카드 배경색) */
    '--color-secondary-0': '15 15 15', // 가장 어두운 배경
    '--color-secondary-50': '20 20 20', // 매우 어두운 배경
    '--color-secondary-100': '30 30 30', // 어두운 배경
    '--color-secondary-200': '40 40 40', // 카드 배경 (사진의 어두운 카드들)
    '--color-secondary-300': '50 50 50', // 중간 어두운 배경
    '--color-secondary-400': '60 60 60', // 중간 배경
    '--color-secondary-500': '75 75 75', // 밝은 회색
    '--color-secondary-600': '90 90 90', // 더 밝은 회색
    '--color-secondary-700': '110 110 110', // 연한 회색
    '--color-secondary-800': '140 140 140', // 밝은 회색
    '--color-secondary-900': '180 180 180', // 매우 밝은 회색
    '--color-secondary-950': '220 220 220', // 거의 화이트

    /* Tertiary - Brown/Gold Accent (사진의 브라운 계열) */
    '--color-tertiary-0': '41 31 20', // 어두운 브라운
    '--color-tertiary-50': '51 38 25', // 진한 브라운
    '--color-tertiary-100': '71 54 35', // 브라운
    '--color-tertiary-200': '102 77 50', // 중간 브라운
    '--color-tertiary-300': '133 101 66', // 밝은 브라운
    '--color-tertiary-400': '164 124 81', // 골드 브라운
    '--color-tertiary-500': '195 148 97', // 라이트 골드
    '--color-tertiary-600': '215 168 117', // 밝은 골드
    '--color-tertiary-700': '235 188 137', // 연한 골드
    '--color-tertiary-800': '245 208 167', // 매우 연한 골드
    '--color-tertiary-900': '250 228 197', // 거의 베이지
    '--color-tertiary-950': '253 238 217', // 베이지

    /* Error - Red (다크 테마용) */
    '--color-error-0': '60 15 15', // 어두운 빨강
    '--color-error-50': '80 20 20', // 진한 빨강
    '--color-error-100': '120 30 30', // 빨강
    '--color-error-200': '160 40 40', // 중간 빨강
    '--color-error-300': '200 50 50', // 밝은 빨강
    '--color-error-400': '230 60 60', // 더 밝은 빨강
    '--color-error-500': '255 75 75', // 메인 에러 빨강
    '--color-error-600': '255 100 100', // 연한 빨강
    '--color-error-700': '255 130 130', // 더 연한 빨강
    '--color-error-800': '255 160 160', // 매우 연한 빨강
    '--color-error-900': '255 190 190', // 거의 핑크
    '--color-error-950': '255 220 220', // 핑크

    /* Success - Green (다크 테마용) */
    '--color-success-0': '15 40 25', // 어두운 초록
    '--color-success-50': '20 50 30', // 진한 초록
    '--color-success-100': '30 70 40', // 초록
    '--color-success-200': '40 90 50', // 중간 초록
    '--color-success-300': '50 110 65', // 밝은 초록
    '--color-success-400': '60 130 80', // 더 밝은 초록
    '--color-success-500': '75 150 95', // 메인 성공 초록
    '--color-success-600': '100 170 120', // 연한 초록
    '--color-success-700': '130 190 150', // 더 연한 초록
    '--color-success-800': '160 210 180', // 매우 연한 초록
    '--color-success-900': '190 230 210', // 거의 민트
    '--color-success-950': '220 245 235', // 민트

    /* Warning - Yellow/Orange (다크 테마용) */
    '--color-warning-0': '50 35 10', // 어두운 노랑
    '--color-warning-50': '70 45 15', // 진한 노랑
    '--color-warning-100': '90 60 20', // 노랑
    '--color-warning-200': '120 80 25', // 중간 노랑
    '--color-warning-300': '150 100 35', // 밝은 노랑
    '--color-warning-400': '180 120 45', // 더 밝은 노랑
    '--color-warning-500': '210 150 60', // 메인 경고 노랑
    '--color-warning-600': '230 170 80', // 연한 노랑
    '--color-warning-700': '240 190 100', // 더 연한 노랑
    '--color-warning-800': '250 210 130', // 매우 연한 노랑
    '--color-warning-900': '255 230 160', // 거의 크림
    '--color-warning-950': '255 245 190', // 크림

    /* Info - Blue (다크 테마용) */
    '--color-info-0': '10 25 45', // 어두운 파랑
    '--color-info-50': '15 35 60', // 진한 파랑
    '--color-info-100': '20 50 80', // 파랑
    '--color-info-200': '30 70 110', // 중간 파랑
    '--color-info-300': '40 90 140', // 밝은 파랑
    '--color-info-400': '50 110 170', // 더 밝은 파랑
    '--color-info-500': '70 130 200', // 메인 정보 파랑
    '--color-info-600': '90 150 220', // 연한 파랑
    '--color-info-700': '120 170 235', // 더 연한 파랑
    '--color-info-800': '150 190 245', // 매우 연한 파랑
    '--color-info-900': '180 210 250', // 거의 하늘색
    '--color-info-950': '210 230 255', // 하늘색

    /* Typography - Dark Theme Text (사진의 텍스트 색상들) */
    '--color-typography-0': '255 255 255', // 순백색 (주요 제목)
    '--color-typography-50': '250 250 250', // 거의 화이트 (메인 텍스트)
    '--color-typography-100': '240 240 240', // 연한 회색 (서브 텍스트)
    '--color-typography-200': '220 220 220', // 밝은 회색 (라벨)
    '--color-typography-300': '200 200 200', // 중간 밝은 회색
    '--color-typography-400': '180 180 180', // 중간 회색 (보조 텍스트)
    '--color-typography-500': '160 160 160', // 회색 (비활성 텍스트)
    '--color-typography-600': '140 140 140', // 어두운 회색
    '--color-typography-700': '120 120 120', // 진한 회색
    '--color-typography-800': '100 100 100', // 매우 진한 회색
    '--color-typography-900': '80 80 80', // 거의 검은 회색
    '--color-typography-950': '60 60 60', // 검은 회색

    /* Outline - Dark Theme Borders */
    '--color-outline-0': '80 80 80', // 밝은 보더
    '--color-outline-50': '70 70 70', // 중간 밝은 보더
    '--color-outline-100': '60 60 60', // 중간 보더
    '--color-outline-200': '50 50 50', // 어두운 보더
    '--color-outline-300': '45 45 45', // 진한 보더
    '--color-outline-400': '40 40 40', // 매우 진한 보더
    '--color-outline-500': '35 35 35', // 카드 보더
    '--color-outline-600': '30 30 30', // 섹션 보더
    '--color-outline-700': '25 25 25', // 구분선
    '--color-outline-800': '20 20 20', // 어두운 구분선
    '--color-outline-900': '15 15 15', // 매우 어두운 구분선
    '--color-outline-950': '10 10 10', // 거의 검은 구분선

    /* Background - Dark Theme (사진의 배경색들) */
    '--color-background-0': '8 8 8', // 메인 배경 (가장 어두운)
    '--color-background-50': '12 12 12', // 앱 배경
    '--color-background-100': '18 18 18', // 컨텐츠 배경
    '--color-background-200': '25 25 25', // 카드 배경 (사진의 어두운 카드들)
    '--color-background-300': '35 35 35', // 액티브 카드 배경
    '--color-background-400': '45 45 45', // 호버 배경
    '--color-background-500': '55 55 55', // 선택된 배경
    '--color-background-600': '70 70 70', // 밝은 배경
    '--color-background-700': '90 90 90', // 더 밝은 배경
    '--color-background-800': '120 120 120', // 매우 밝은 배경
    '--color-background-900': '180 180 180', // 거의 화이트
    '--color-background-950': '240 240 240', // 화이트 배경

    /* Background Special - Dark Theme */
    '--color-background-error': '40 20 20', // 에러 배경 (어두운 빨강)
    '--color-background-warning': '45 35 15', // 경고 배경 (어두운 노랑)
    '--color-background-success': '20 35 25', // 성공 배경 (어두운 초록)
    '--color-background-muted': '30 30 30', // 뮤트 배경 (회색)
    '--color-background-info': '20 30 40', // 정보 배경 (어두운 파랑)

    /* Focus Ring Indicator - Dark Theme (포커스 표시용) */
    '--color-indicator-primary': '255 107 53', // 메인 오렌지 (포커스 링)
    '--color-indicator-info': '70 130 200', // 정보 파랑 (포커스 링)
    '--color-indicator-error': '255 75 75', // 에러 빨강 (포커스 링)
  }),
};
