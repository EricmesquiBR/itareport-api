-- CreateTable
CREATE TABLE "Usuario" (
    "id_user" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "cpf" VARCHAR(15) NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id_adress" UUID NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "district" VARCHAR(20) NOT NULL,
    "city" VARCHAR(30) NOT NULL,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id_adress")
);

-- CreateTable
CREATE TABLE "Denuncia" (
    "id_report" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "adressId" UUID NOT NULL,

    CONSTRAINT "Denuncia_pkey" PRIMARY KEY ("id_report")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_adressId_fkey" FOREIGN KEY ("adressId") REFERENCES "Endereco"("id_adress") ON DELETE RESTRICT ON UPDATE CASCADE;
