# 📚 Backend Security & Architecture Analysis

## Phân Tích Sâu: Error Management | JWT Authentication | CORS

> **Mục đích**: Tài liệu này được viết theo phương pháp Socratic - giúp bạn không chỉ biết "làm gì" mà còn hiểu "tại sao làm vậy" và "nguy cơ nào có thể xảy ra".

---

## 🔴 PHẦN 1: CÔ CHẾ QUẢN LÝ LỖI (Error Management)

### 💭 Khơi gợi tư duy

**Câu hỏi 1:** Tại sao không để Spring Boot tự động trả về lỗi mặc định (như `Whitelabel Error Page`)?

**Trả lời:** Vì lỗi mặc định:

- ❌ Lộ thông tin nhạy cảm (stack trace, internal paths, version framework)
- ❌ Không có format chuẩn → Frontend khó xử lý
- ❌ Không phân biệt được lỗi do user hay do server

**Câu hỏi 2:** Lỗi Operational vs Programming khác nhau thế nào?

**Trả lời:**

- **Operational Error** (Lỗi vận hành): Có thể dự đoán được, người dùng gây ra
  - Ví dụ: Email đã tồn tại, sai password, không tìm thấy user
  - ✅ Có thể xử lý và trả về message thân thiện
- **Programming Error** (Lỗi lập trình): Không dự đoán được, do bug trong code
  - Ví dụ: NullPointerException, ArrayIndexOutOfBounds, chia cho 0
  - ⚠️ Không nên lộ chi tiết, chỉ nói "Internal Server Error"

---

### 📖 Nguyên lý & Checklist

#### **Để làm được thì cần làm gì:**

1. **Tạo Centralized Exception Handler** (Handler tập trung)
   - Dùng `@RestControllerAdvice` để bắt lỗi từ tất cả Controller
2. **Định nghĩa Error Response chuẩn**
   - Có structure nhất quán: `{ code, message, timestamp }`
3. **Phân loại exception** theo type:
   - Business/Operational → 400/404
   - Validation → 400
   - System/Unknown → 500
4. **Che giấu thông tin nhạy cảm**
   - Không trả stack trace
   - Không lộ database query/internal path

#### **Tại sao lại làm bước này:**

| Bước                 | Lý do (Rationale)                                                     |
| -------------------- | --------------------------------------------------------------------- |
| Handler tập trung    | Tránh duplicate code xử lý lỗi ở mỗi Controller. DRY principle.       |
| Error Response chuẩn | Frontend chỉ cần 1 logic để parse error, dễ maintain.                 |
| Phân loại exception  | HTTP status code phải đúng nghĩa (semantic) để client biết xử lý.     |
| Che giấu thông tin   | Bảo mật: Hacker không biết bạn dùng framework gì, cấu trúc DB ra sao. |

---

### 🔍 Phân tích Code của bạn

#### **File: `GlobalExceptionHandler.java`**

```java
@RestControllerAdvice  // ✅ Centralized handler
public class GlobalExceptionHandler {
```

**→ Giải thích:** Annotation này biến class thành một "safety net" (lưới an toàn) bắt mọi exception từ tất cả `@RestController`.

---

#### **Handler 1: BusinessException (Lỗi nghiệp vụ)**

```java
@ExceptionHandler(BusinessException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
    ErrorCode errorCode = ex.getErrorCode();
    ErrorResponse response = new ErrorResponse(
        errorCode.getCode(),
        errorCode.getMessage(),
        LocalDate.now()
    );
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
}
```

**→ Bước nào trong lý thuyết?** Bước 3: Phân loại exception  
**→ Flow đi:**

1. Controller throw `new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS)`
2. GlobalExceptionHandler bắt
3. Lấy ErrorCode từ exception
4. Wrap vào ErrorResponse
5. Trả về 400 BAD_REQUEST

**→ Ví dụ Response:**

```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email already exists",
  "timestamp": "2025-12-19"
}
```

---

#### **Handler 2: Validation Error**

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult()
            .getFieldErrors()
            .get(0)  // ⚠️ Chỉ lấy lỗi đầu tiên
            .getDefaultMessage();
    ErrorResponse response = new ErrorResponse(
            "VALIDATION_ERROR",
            message,
            LocalDate.now()
    );
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
}
```

**→ Trigger khi nào?** Khi `@Valid` fail ở Controller  
**→ Ví dụ:** User gửi `{"email": "invalid"}` → Spring validate fail → Handler này bắt

---

#### **Handler 3: Catch-all System Error**

```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleSystemException(Exception ex) {
    ErrorResponse response = new ErrorResponse(
            ErrorCode.INTERNAL_ERROR.getCode(),
            ErrorCode.INTERNAL_ERROR.getMessage(),  // ✅ Generic message
            LocalDate.now()
    );
    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

**→ Bắt gì?** Tất cả exception chưa được handle ở trên (NullPointer, SQLException...)  
**→ Trả về:** `"Internal server error"` → ✅ Không lộ chi tiết

---

### 🛑 Đánh giá Best Practice (Audit)

#### ✅ **Điểm tốt:**

1. ✅ **Centralized handling** - Tất cả lỗi đi qua một chỗ
2. ✅ **Consistent structure** - ErrorResponse luôn có cùng format
3. ✅ **Không lộ stack trace** - System error chỉ trả generic message
4. ✅ **Status code hợp lý** - 400 cho business, 500 cho system

---

#### ⚠️ **Cảnh báo/Rủi ro:**

| Vấn đề                                 | Mô tả                                        | Nguy cơ                                         |
| -------------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| **1. Timestamp dùng LocalDate**        | Chỉ có ngày, không có giờ phút giây          | Debug khó khăn khi nhiều request cùng lúc       |
| **2. Validation chỉ lấy lỗi đầu tiên** | `.get(0)` → Người dùng phải sửa từng lỗi một | UX không tốt                                    |
| **3. Không log exception**             | System error không được ghi log              | Production xảy ra lỗi mà không biết nguyên nhân |
| **4. Hardcode "VALIDATION_ERROR"**     | Không lấy từ ErrorCode enum                  | Không nhất quán với các error code khác         |

---

#### 💡 **Đề xuất cải thiện:**

**Fix 1: Dùng LocalDateTime thay vì LocalDate**

```java
// ❌ Cũ
private LocalDate timestamp;

// ✅ Mới
private LocalDateTime timestamp;
```

**Fix 2: Trả về TẤT CẢ lỗi validation**

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex) {

    // Lấy tất cả lỗi
    List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .toList();

    String message = String.join(", ", errors);
    // ... rest code
}
```

**Fix 3: Thêm logging cho debug**

```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleSystemException(Exception ex) {
    log.error("Unexpected error occurred", ex);  // ← Log full exception

    // Client chỉ nhận generic message
    ErrorResponse response = new ErrorResponse(
            ErrorCode.INTERNAL_ERROR.getCode(),
            ErrorCode.INTERNAL_ERROR.getMessage(),
            LocalDateTime.now()
    );
    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

**Fix 4: Định nghĩa VALIDATION_ERROR trong ErrorCode enum**

```java
public enum ErrorCode {
    // Existing codes...
    VALIDATION_ERROR("VALIDATION_ERROR", "Invalid input data"),  // ← Thêm vào
    // ...
}
```

---

## 🔐 PHẦN 2: THIẾT LẬP JWT (JSON Web Token)

### 💭 Khơi gợi tư duy

**Câu hỏi 1:** Tại sao dùng JWT thay vì Session truyền thống?

**Trả lời:**

| Session (Cookie-based)                     | JWT (Stateless)                              |
| ------------------------------------------ | -------------------------------------------- |
| Server phải lưu session trong memory/Redis | Server không lưu gì, chỉ verify signature    |
| Khó scale horizontal (cần share session)   | Dễ scale: mỗi server độc lập                 |
| Cookie bị CSRF attack                      | Lưu trong localStorage/memory, không bị CSRF |

**Câu hỏi 2:** JWT gồm 3 phần nào? Tại sao có signature?

**Trả lời:**

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.Xjq3k...
└── Header ──┘ └── Payload ──┘ └─ Signature ─┘
```

- **Header:** Khai báo thuật toán (HS256, RS256...)
- **Payload:** Chứa data (userId, email, exp...)
- **Signature:** `HMAC(header + payload, SECRET_KEY)`
  - ✅ Đảm bảo token không bị sửa đổi
  - ✅ Nếu hacker sửa payload → signature không khớp → verify fail

**Câu hỏi 3:** Stateless nghĩa là gì?

**Trả lời:** Server không lưu "ai đang login". Mỗi request, client gửi JWT, server chỉ việc:

1. Decode JWT
2. Verify signature
3. Kiểm tra hết hạn chưa
   → Không cần query database để check session!

---

### 📖 Nguyên lý & Checklist

#### **Để làm được thì cần làm gì:**

1. **Generate JWT khi login thành công**
   - Input: userId, email, ...
   - Output: Signed JWT string
2. **Verify JWT từ request header**
   - Parse header `Authorization: Bearer <token>`
   - Verify signature + expiration
3. **Extract data từ JWT**
   - Decode payload để lấy userId
   - Load user từ DB (hoặc cache)
4. **Set Authentication vào SecurityContext**
   - Spring Security biết "ai đang request"

#### **Tại sao lại làm bước này:**

| Bước                | Lý do                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| Generate JWT        | Thay vì gửi username/password mỗi lần, chỉ cần gửi token 1 lần duy nhất. |
| Verify JWT          | Đảm bảo token không bị giả mạo hoặc hết hạn.                             |
| Extract data        | Biết request này là của user nào để check permission.                    |
| Set SecurityContext | Cho phép dùng `@PreAuthorize`, `SecurityContextHolder` trong code.       |

---

### 🔍 Phân tích Code của bạn

#### **File: `JwtTokenProvider.java`**

##### **1. Khởi tạo Secret Key**

```java
@Value("${jwt.secret}")
private String secretKey;  // Đọc từ application.properties

@PostConstruct
public void init() {
    this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
}
```

**→ Flow:**

1. Spring inject `jwt.secret` từ properties
2. `@PostConstruct` chạy sau khi bean được tạo
3. Convert string → Key object (dùng cho HMAC SHA-256)

**⚠️ Quan trọng:** `hmacShaKeyFor` yêu cầu key tối thiểu 256 bits (32 bytes)

---

##### **2. Generate Token (Tạo JWT)**

```java
public String generateToken(Long userId, String email) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);  // expiration = 86400000ms = 24h

    return Jwts.builder()
            .setSubject(String.valueOf(userId))  // ← Subject = userId
            .claim("email", email)                // ← Custom claim
            .setIssuedAt(now)                     // ← Issued time
            .setExpiration(expiryDate)            // ← Expiry time
            .signWith(key, SignatureAlgorithm.HS256)  // ← Sign with HMAC-SHA256
            .compact();                           // ← Build string
}
```

**→ Khi nào gọi?** Trong `UserService.login()` sau khi verify password  
**→ Output:** String như `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZW1haWwiOi...`

**→ Decoded Payload sẽ là:**

```json
{
  "sub": "1", // userId
  "email": "user@example.com",
  "iat": 1734624000, // Issued at timestamp
  "exp": 1734710400 // Expiration timestamp
}
```

---

##### **3. Validate Token (Kiểm tra JWT hợp lệ)**

```java
public boolean validateToken(String token) {
    try {
        Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);  // ← Verify signature + expiration
        return true;
    } catch (JwtException | IllegalArgumentException ex) {
        return false;  // ← Token invalid hoặc expired
    }
}
```

**→ Library tự động check:**

- ✅ Signature có khớp không?
- ✅ Token có hết hạn chưa? (so sánh `exp` với thời gian hiện tại)
- ✅ Format có đúng không?

---

##### **4. Extract User ID**

```java
public Long getUserIdFromToken(String token) {
    Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();  // ← Get payload

    return Long.parseLong(claims.getSubject());  // sub = "1" → 1L
}
```

---

#### **File: `JwtAuthenticationFilter.java`**

##### **Flow xác thực:**

```java
@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

    // Bước 1: Lấy token từ header
    String token = getTokenFromRequest(request);

    // Bước 2: Validate token
    if (token != null && jwtTokenProvider.validateToken(token)) {
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        // Bước 3: Load user từ DB
        userRepository.findById(userId).ifPresent(user -> {
            // Bước 4: Tạo authorities (ROLE_ADMIN hoặc ROLE_USER)
            List<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(
                            "ROLE_" + (user.getRoleId() == 1 ? "ADMIN" : "USER")));

            // Bước 5: Set authentication vào SecurityContext
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        });
    }

    // Bước 6: Chuyển request sang filter/controller tiếp theo
    filterChain.doFilter(request, response);
}
```

**→ Vị trí trong chain:** Chạy TRƯỚC `UsernamePasswordAuthenticationFilter`

---

##### **Helper: Parse Authorization Header**

```java
private String getTokenFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");

    // Format: "Bearer eyJhbGciOiJIUzI1NiJ9..."
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        return bearerToken.substring(7);  // Remove "Bearer " prefix
    }
    return null;
}
```

---

### 🛑 Đánh giá Best Practice (Audit)

#### ✅ **Điểm tốt:**

1. ✅ **Stateless** - Không lưu session, dễ scale
2. ✅ **Signature verification** - Chống giả mạo token
3. ✅ **Expiration check** - Token tự hết hạn sau 24h
4. ✅ **Role-based authorities** - Map roleId → ROLE_ADMIN/USER
5. ✅ **Once per request** - `OncePerRequestFilter` đảm bảo chỉ chạy 1 lần

---

#### ⚠️ **Cảnh báo/Rủi ro:**

| Vấn đề                            | Mô tả                                          | Nguy cơ                                      | Severity    |
| --------------------------------- | ---------------------------------------------- | -------------------------------------------- | ----------- |
| **1. Secret key trong plaintext** | `jwt.secret=mySecret...` trong file properties | ❌ Git history lưu lại → Ai cũng biết secret | 🔴 CRITICAL |
| **2. Expiration quá dài**         | 24 giờ (86400000ms)                            | Token bị đánh cắp → Hacker có 24h để exploit | 🟡 MEDIUM   |
| **3. Không có refresh token**     | User phải login lại sau 24h                    | UX không tốt cho long-running session        | 🟢 LOW      |
| **4. Không có token revocation**  | Không thể "logout" thực sự                     | Token bị leak vẫn valid cho đến khi hết hạn  | 🟡 MEDIUM   |
| **5. Query DB mỗi request**       | `userRepository.findById(userId)`              | Performance bottleneck nếu traffic cao       | 🟡 MEDIUM   |
| **6. Hardcode role mapping**      | `roleId == 1 ? "ADMIN" : "USER"`               | Thêm role mới phải sửa code                  | 🟢 LOW      |

---

#### 💡 **Đề xuất cải thiện:**

**Fix 1: Di chuyển secret vào Environment Variable**

```properties
# ❌ Cũ (trong application.properties)
jwt.secret=mySecretKeyForJwtTokenGenerationAndValidation12345678901234567890

# ✅ Mới (trong .env hoặc server environment)
# File application.properties:
jwt.secret=${JWT_SECRET}

# File .env (không commit vào Git):
JWT_SECRET=random_generated_256bit_key_here
```

**Tạo secret key an toàn:**

```bash
# Dùng openssl tạo random 32 bytes
openssl rand -base64 32
# Output: Lkj83HnFk2qQ9MxPvZc...
```

---

**Fix 2: Giảm expiration xuống 15 phút + Refresh Token**

```properties
jwt.access-token.expiration=900000    # 15 minutes
jwt.refresh-token.expiration=604800000 # 7 days
```

```java
public class JwtTokenProvider {
    // Tạo 2 loại token
    public String generateAccessToken(Long userId) { ... }
    public String generateRefreshToken(Long userId) { ... }
}
```

**Flow:**

1. Login → Nhận cả Access Token + Refresh Token
2. Access Token hết hạn sau 15 phút
3. Frontend gọi `/api/auth/refresh` với Refresh Token
4. Server issue Access Token mới

---

**Fix 3: Implement Token Blacklist (Revocation)**

```java
// Service để blacklist token
@Service
public class TokenBlacklistService {
    private final RedisTemplate<String, String> redisTemplate;

    public void blacklistToken(String token, long expirationTime) {
        // Lưu vào Redis với TTL = thời gian còn lại của token
        redisTemplate.opsForValue().set(
            "blacklist:" + token,
            "true",
            expirationTime,
            TimeUnit.MILLISECONDS
        );
    }

    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(
            redisTemplate.hasKey("blacklist:" + token)
        );
    }
}

// Trong JwtAuthenticationFilter
if (token != null && jwtTokenProvider.validateToken(token)
        && !tokenBlacklistService.isBlacklisted(token)) {
    // ... authenticate
}
```

---

**Fix 4: Cache User Info (Tránh query DB mỗi lần)**

```java
@Service
public class UserCacheService {
    private final RedisTemplate<String, User> redisTemplate;

    public Optional<User> getCachedUser(Long userId) {
        return Optional.ofNullable(
            redisTemplate.opsForValue().get("user:" + userId)
        );
    }
}

// Trong Filter:
userCacheService.getCachedUser(userId)
    .or(() -> userRepository.findById(userId))  // Fallback to DB
    .ifPresent(user -> { ... });
```

---

**Fix 5: Dynamic Role Mapping**

```java
// User entity
@Entity
public class User {
    // ...
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;  // ← Relation thay vì Integer
}

@Entity
public class Role {
    @Id
    private Long id;

    @Column(unique = true)
    private String name;  // ADMIN, USER, MODERATOR...

    @ManyToMany
    private List<Permission> permissions;
}

// Filter
List<GrantedAuthority> authorities = user.getRole()
    .getPermissions()
    .stream()
    .map(perm -> new SimpleGrantedAuthority(perm.getName()))
    .toList();
```

---

## 🌐 PHẦN 3: THIẾT LẬP CORS (Cross-Origin Resource Sharing)

### 💭 Khơi gợi tư duy

**Câu hỏi 1:** Tại sao trình duyệt chặn CORS mà Postman thì không?

**Trả lời:**

- **Same-Origin Policy** là chính sách BẢO MẬT của TRÌNH DUYỆT
- Frontend: `http://localhost:3000` (origin A)
- Backend: `http://localhost:8081` (origin B)
  → A ≠ B → Browser chặn!

**Postman không chặn vì:**

- Postman không phải browser → Không có Same-Origin Policy
- CORS chỉ áp dụng cho web browsers

---

**Câu hỏi 2:** Preflight request (OPTIONS) là gì?

**Trả lời:**
Với một số request "phức tạp" (có header `Authorization`, method `PUT/DELETE`...), browser gửi OPTIONS trước để hỏi server:

```http
OPTIONS /api/users/1 HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization
```

Server phải trả lời:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization
```

→ Browser mới cho phép gửi request thật (DELETE)

---

**Câu hỏi 3:** Credentials nghĩa là gì?

**Trả lời:** Cookies, Authorization headers, TLS certificates  
→ Nếu set `credentials: 'include'` trong fetch(), browser sẽ gửi kèm cookies  
→ Server phải cho phép: `Access-Control-Allow-Credentials: true`

---

### 📖 Nguyên lý & Checklist

#### **Để làm được thì cần làm gì:**

1. **Định nghĩa allowed origins** (Cho phép domain nào?)
   - Production: `https://myapp.com`
   - Development: `http://localhost:3000`
2. **Định nghĩa allowed methods** (Cho phép HTTP method nào?)
   - GET, POST, PUT, DELETE, OPTIONS, PATCH
3. **Định nghĩa allowed headers** (Client được gửi header gì?)
   - `Authorization`, `Content-Type`, custom headers...
4. **Set credentials flag** (Cho phép gửi cookies không?)
   - `true` nếu cần authentication
5. **Set max age** (Cache preflight bao lâu?)
   - Tránh gửi OPTIONS liên tục

#### **Tại sao lại làm bước này:**

| Bước            | Lý do                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Allowed origins | Chỉ frontend của bạn mới gọi được API, không phải bất kỳ website nào. |
| Allowed methods | Browser cần biết method nào được phép để validate.                    |
| Allowed headers | Nếu không cho phép `Authorization`, JWT không gửi được.               |
| Credentials     | Cần cho session-based auth hoặc gửi cookies.                          |
| Max age         | Giảm số lượng preflight requests, tăng performance.                   |

---

### 🔍 Phân tích Code của bạn

#### **File: `SecurityConfig.java` - CORS Configuration**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // 1. Allowed Origins
    configuration.setAllowedOrigins(
        Arrays.asList("http://localhost:3000", "http://localhost:5173")
    );

    // 2. Allowed Methods
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
    );

    // 3. Allowed Headers
    configuration.setAllowedHeaders(Arrays.asList("*"));  // ⚠️ Wildcard

    // 4. Credentials
    configuration.setAllowCredentials(true);

    // 5. Max Age (seconds)
    configuration.setMaxAge(3600L);  // 1 hour

    // Register cho tất cả endpoints
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

**→ Flow khi Frontend gửi request:**

**Request:**

```javascript
fetch("http://localhost:8081/api/users", {
  method: "POST",
  headers: {
    Authorization: "Bearer eyJhbG...",
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({ name: "John" }),
});
```

**Browser tự động gửi Preflight:**

```http
OPTIONS /api/users HTTP/1.1
Host: localhost:8081
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

**Server trả về (do CORS config):**

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

→ ✅ Browser cho phép gửi request POST thật

---

#### **SecurityFilterChain - Apply CORS**

```java
http
    .csrf(csrf -> csrf.disable())  // Disable CSRF vì dùng JWT (stateless)
    .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // ← Apply CORS
    .sessionManagement(...)
    .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // ← Allow preflight
        .requestMatchers("/api/auth/**").permitAll()
        .anyRequest().authenticated()
    )
```

**→ Quan trọng:**

- `OPTIONS /**` phải `permitAll()` để preflight không cần authentication
- Nếu không có dòng này → OPTIONS bị reject → CORS fail

---

### 🛑 Đánh giá Best Practice (Audit)

#### ✅ **Điểm tốt:**

1. ✅ **Explicit origins** - Không dùng `*`, chỉ định rõ localhost:3000 và 5173
2. ✅ **Allow credentials** - Cho phép gửi JWT trong header
3. ✅ **Allow OPTIONS** - Preflight requests được permit
4. ✅ **Max age** - Cache preflight 1 giờ, giảm overhead

---

#### ⚠️ **Cảnh báo/Rủi ro:**

| Vấn đề                            | Mô tả                                        | Nguy cơ                                           | Severity  |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------- | --------- |
| **1. Wildcard headers `*`**       | `setAllowedHeaders(Arrays.asList("*"))`      | Cho phép MỌI header → Có thể bị CSRF-like attacks | 🟡 MEDIUM |
| **2. Hardcode origins**           | Localhost hardcode trong code                | Deploy production phải nhớ sửa code               | 🟢 LOW    |
| **3. Không có origin validation** | Nếu typo `http://localhots:3000` → Vẫn fail  | Developer confusion                               | 🟢 LOW    |
| **4. HTTP instead of HTTPS**      | `http://localhost` OK dev, nhưng production? | Production cần HTTPS cho security                 | 🟡 MEDIUM |

---

#### 💡 **Đề xuất cải thiện:**

**Fix 1: Explicit Headers (Không dùng wildcard)**

```java
// ❌ Cũ
configuration.setAllowedHeaders(Arrays.asList("*"));

// ✅ Mới
configuration.setAllowedHeaders(Arrays.asList(
    "Authorization",
    "Content-Type",
    "Accept",
    "X-Requested-With"
));
```

**Tại sao?** Principle of Least Privilege - Chỉ cho phép những gì cần thiết.

---

**Fix 2: Environment-based Origins**

```properties
# application-dev.properties
cors.allowed-origins=http://localhost:3000,http://localhost:5173

# application-prod.properties
cors.allowed-origins=https://myapp.com,https://www.myapp.com
```

```java
@Value("${cors.allowed-origins}")
private String[] allowedOrigins;

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
    // ...
}
```

---

**Fix 3: Validation Logic cho Origins**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Pattern matching thay vì hardcode
    configuration.setAllowedOriginPatterns(
        Arrays.asList(
            "http://localhost:[*]",      // Any localhost port
            "https://*.myapp.com"        // Subdomain của production
        )
    );

    // ... rest config
}
```

---

**Fix 4: Exposed Headers (Nếu cần)**

Nếu backend trả về custom headers (ví dụ `X-Total-Count` cho pagination):

```java
configuration.setExposedHeaders(Arrays.asList(
    "X-Total-Count",
    "X-Page-Number",
    "Authorization"  // Nếu server gửi token mới trong response header
));
```

→ Frontend mới access được `response.headers.get('X-Total-Count')`

---

## 📊 TỔNG KẾT: Security Checklist

### 🔴 CRITICAL (Phải sửa ngay)

- [ ] **JWT Secret trong environment variable**, không commit vào Git
- [ ] **HTTPS trong production** (không dùng HTTP)
- [ ] **Validate tất cả user input** (SQL injection, XSS prevention)

### 🟡 IMPORTANT (Nên cải thiện)

- [ ] **JWT expiration giảm xuống** (15-30 phút) + Refresh Token
- [ ] **Token revocation mechanism** (Blacklist trong Redis)
- [ ] **Rate limiting** (Chống brute-force login)
- [ ] **Logging cho security events** (Failed login, token validation errors)

### 🟢 NICE TO HAVE (Tối ưu thêm)

- [ ] **User cache** (Giảm query DB trong JWT filter)
- [ ] **Dynamic role/permission** (Không hardcode roleId == 1)
- [ ] **API versioning** (`/api/v1/...`)
- [ ] **Health check endpoint** (`/actuator/health`)

---

## 🎓 Bài học rút ra

### 1. **Error Management**

- ✅ Centralized handling giúp code DRY và dễ maintain
- ⚠️ Phải phân biệt: Operational error (user-facing) vs System error (hide details)
- 💡 Luôn log system errors để debug production

### 2. **JWT Authentication**

- ✅ Stateless → Dễ scale, không cần session storage
- ⚠️ Secret key = Crown jewel → Phải bảo vệ tuyệt đối
- 💡 Token bị leak = attacker có toàn quyền trong thời gian expiration

### 3. **CORS**

- ✅ Browser security mechanism, không phải backend bug
- ⚠️ Wildcard `*` rất nguy hiểm trong production
- 💡 Preflight (OPTIONS) phải permit all, nếu không → CORS fail

---

## 📚 Tài liệu tham khảo

### Error Handling

- [Spring Boot Error Handling Best Practices](https://www.baeldung.com/exception-handling-for-rest-with-spring)
- [HTTP Status Codes Semantic](https://www.restapitutorial.com/httpstatuscodes.html)

### JWT

- [JWT.io - Debugger & Introduction](https://jwt.io)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

### CORS

- [MDN Web Docs - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Spring CORS Configuration](https://spring.io/guides/gs/rest-service-cors/)

---

**🎯 Next Steps:**

1. Review code theo các warning ⚠️ được đánh dấu
2. Implement ít nhất các fix CRITICAL 🔴
3. Test với các attack scenarios (Token tampering, CORS bypass, SQL injection...)
4. Setup monitoring & alerting cho security events

---

_Document này được tạo theo phương pháp Socratic Learning - Học qua câu hỏi & phân tích thực tế._  
_Last updated: 2025-12-19_
