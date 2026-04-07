-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'super_admin');

-- CreateEnum
CREATE TYPE "StatusDevice" AS ENUM ('CONNECTED', 'DISCONNECTED', 'CONNECTING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" "StatusDevice" NOT NULL DEFAULT 'CONNECTING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledges" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "embedding" vector(1024),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "whatsapp_id" TEXT,
    "from_me" BOOLEAN NOT NULL DEFAULT false,
    "remote_jid" TEXT NOT NULL,
    "push_name" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "status" TEXT NOT NULL DEFAULT 'sent',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_replies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL DEFAULT 'keyword',
    "trigger_keyword" TEXT,
    "reply_content" TEXT,
    "ai_prompt" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auto_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_username_email_idx" ON "users"("username", "email");

-- CreateIndex
CREATE INDEX "messages_remote_jid_idx" ON "messages"("remote_jid");

-- CreateIndex
CREATE INDEX "auto_replies_is_active_idx" ON "auto_replies"("is_active");
