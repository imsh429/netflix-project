# 넷플릭스 클론 프로젝트

넷플릭스를 모티브로 제작된 스트리밍 애플리케이션으로, 사용자가 영화를 탐색하고, 위시리스트에 추가하며, 인증 기능을 통해 원활하게 로그인 및 회원가입을 진행할 수 있습니다. 동적 UI 컴포넌트, 무한 스크롤, 그리고 LocalStorage 관리를 활용하여 개발되었습니다.

---

## 🚀 주요 기능
- **유저 인증**: 이메일 기반 로그인 및 회원가입, 부드러운 전환 효과.
- **영화 탐색**: TMDb API를 통해 인기 영화, 최신 영화, 장르별 영화를 탐색 가능.
- **위시리스트 관리**: 위시리스트에 즐겨찾는 영화를 추가/삭제하며 LocalStorage를 통해 데이터 지속성 제공.
- **반응형 UI**: 데스크탑과 모바일 모두에서 최적화된 사용자 경험 제공.
- **무한 스크롤**: 영화를 탐색할 때 자동으로 데이터를 로드하여 UX 향상.

---

## 📂 프로젝트 구조
프로젝트는 아래와 같은 구조로 구성되어 있습니다:
src/
│
├── assets/               # 정적 파일 (이미지, 폰트 등)
│
├── components/           # 재사용 가능한 Vue 컴포넌트
│   ├── AppHeader.vue          # 헤더 UI 및 네비게이션
│   ├── InfiniteScrollView.vue # 무한 스크롤 관련 UI
│   ├── SearchFilter.vue       # 필터링 및 정렬 UI
│   └── WishlistInfiniteView.vue # 위시리스트 무한 스크롤 뷰
│
├── composables/          # Composition API 재사용 로직
│   └── useMovies.js          # 영화 데이터 관리
│
├── router/               # Vue Router 설정
│   └── index.js             # 라우트 경로 및 컴포넌트 매핑
│
├── services/             # 외부 API 및 인증 로직
│   ├── AuthenticationService.js # 사용자 인증 로직
│   └── tmdbService.js         # TMDb API 호출 로직
│
├── utils/                # 공통 유틸리티 함수
│   └── storage.js           # Local Storage 관리 함수
│
├── views/                # 페이지 단위 컴포넌트
│   ├── Auth.vue             # 로그인/회원가입 UI
│   ├── HomePage.vue         # 홈 화면
│   ├── MovieDetail.vue      # 영화 상세 정보 페이지
│   ├── PopularMovies.vue    # 인기 영화 페이지
│   ├── SearchMovies.vue     # 영화 검색 페이지
│   └── WishlistMovies.vue   # 위시리스트 페이지
│
└── App.vue               # 최상위 Vue 컴포넌트
└── main.js               # Vue 애플리케이션 초기화

---

## 🛠️ 기술 스택
- **프론트엔드 프레임워크**: [Vue.js](https://vuejs.org/)
- **스타일링**: CSS3와 Scoped 스타일, 애니메이션 활용
- **빌드 도구**: Vue CLI, Webpack
- **상태 관리**: Vue Composition API
- **Local Storage**: 위시리스트 및 사용자 설정 데이터 저장
- **API**: [TMDb API](https://www.themoviedb.org/documentation/api)

---

## 📋 설치 및 실행 가이드

### 1. 프로젝트 복제 및 설치
```bash
git clone <repository-url>
cd netflix-project
npm install
```
### 2. 개발 모드 실행
npm run serve
```
```
### 3. 프로덕션 빌드
npm run build
```
```
### 4. 코드 린트 및 자동 수정
npm run lint
```