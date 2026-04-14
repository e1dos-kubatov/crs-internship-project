# Car Rental Backend

Spring Boot 3 backend for a Car Rental System using Java 17, PostgreSQL, JWT and OAuth2.

Run locally:

```powershell
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_real_postgres_password"
$env:DB_URL="jdbc:postgresql://localhost:5432/car-rental-system"
$env:GOOGLE_CLIENT_ID="your_google_client_id"
$env:GOOGLE_CLIENT_SECRET="your_google_client_secret"
mvn spring-boot:run
```

Main URL: `http://localhost:8081`
Temporary frontend: `http://localhost:8081/`
Default admin: `admin@carrental.com` / `Admin123!`

If startup fails with `password authentication failed for user "postgres"`, your PostgreSQL password is different from the default. Set `DB_PASSWORD` to the real password before starting the app.

For Google login, add this redirect URI in Google Cloud Console:
`http://localhost:8081/login/oauth2/code/google`
