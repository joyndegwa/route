-- Add Digital Product Passport fields to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS material_composition TEXT,
  ADD COLUMN IF NOT EXISTS carbon_footprint_kg DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS circular_economy_score INTEGER,
  ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS repairability_score INTEGER;

-- Update passport display order/indexes if needed
COMMENT ON COLUMN public.products.material_composition IS 'Material composition breakdown for the device';
COMMENT ON COLUMN public.products.carbon_footprint_kg IS 'Estimated carbon footprint in kg CO2e';
COMMENT ON COLUMN public.products.circular_economy_score IS 'Circular economy score from 0-100';
COMMENT ON COLUMN public.products.estimated_value IS 'Estimated residual value in USD';
COMMENT ON COLUMN public.products.repairability_score IS 'Repairability score from 0-100';
