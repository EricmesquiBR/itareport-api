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
CREATE TABLE "Denuncia" (
    "id_report" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "district" VARCHAR(20) NOT NULL,
    "city" VARCHAR(30) NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "userId" UUID NOT NULL,
    "catId" UUID NOT NULL,

    CONSTRAINT "Denuncia_pkey" PRIMARY KEY ("id_report")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" UUID NOT NULL,
    "nome_categoria" VARCHAR(50) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;
