-- CreateEnum
CREATE TYPE "languages" AS ENUM ('english', 'russian');

-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('book', 'docs', 'article');

-- CreateEnum
CREATE TYPE "knowledge" AS ENUM ('again', 'hard', 'good', 'easy');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "last_streak" TIMESTAMP(6) NOT NULL DEFAULT '1970-01-01 00:00:01'::timestamp without time zone,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word" (
    "id" SERIAL NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "language" "languages" NOT NULL DEFAULT 'english',

    CONSTRAINT "word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurred_word" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "source_type" "source_type" NOT NULL DEFAULT 'book',
    "occurrences" INTEGER NOT NULL,

    CONSTRAINT "occurred_word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_word" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,

    CONSTRAINT "saved_word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "translations" VARCHAR(255)[],
    "definitions" VARCHAR(255)[],
    "examples" VARCHAR(255)[],
    "knowledge" "knowledge" DEFAULT 'again',

    CONSTRAINT "user_word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_word" (
    "id" SERIAL NOT NULL,
    "deck_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,

    CONSTRAINT "deck_word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "word_value_language_key" ON "word"("value", "language");

-- CreateIndex
CREATE UNIQUE INDEX "occurred_word_word_id_source_key" ON "occurred_word"("word_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "saved_word_user_id_word_id_key" ON "saved_word"("user_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_word_user_id_word_id_key" ON "user_word"("user_id", "word_id");

-- CreateIndex
CREATE UNIQUE INDEX "deck_word_deck_id_word_id_key" ON "deck_word"("deck_id", "word_id");

-- AddForeignKey
ALTER TABLE "occurred_word" ADD CONSTRAINT "occurred_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_word" ADD CONSTRAINT "saved_word_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_word" ADD CONSTRAINT "saved_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word" ADD CONSTRAINT "user_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck" ADD CONSTRAINT "deck_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_word" ADD CONSTRAINT "deck_word_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_word" ADD CONSTRAINT "deck_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
