-- AlterTable: add weight/dimensions to Product
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "weightGrams" INTEGER,
  ADD COLUMN IF NOT EXISTS "heightCm" INTEGER,
  ADD COLUMN IF NOT EXISTS "widthCm" INTEGER,
  ADD COLUMN IF NOT EXISTS "depthCm" INTEGER;

-- AlterTable: add shipping method/cost/tracking to Order
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "shippingMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "shippingCost" DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "trackingCode" TEXT;

-- CreateTable: ShippingZone for motoboy CEP ranges
CREATE TABLE IF NOT EXISTS "ShippingZone" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "cepStart" TEXT NOT NULL,
  "cepEnd" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "deliveryDays" INTEGER NOT NULL DEFAULT 1,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ShippingZone_pkey" PRIMARY KEY ("id")
);
