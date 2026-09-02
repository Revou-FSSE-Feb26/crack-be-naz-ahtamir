# Start Prisma Studio with DATABASE_URL from .env
$env:DATABASE_URL = "postgresql://postgres:postgres123@localhost:5432/smk3_db"
npx prisma studio
