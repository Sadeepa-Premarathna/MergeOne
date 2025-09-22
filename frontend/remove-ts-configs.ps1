# Helper script to remove TS configs that cause ts-node ESM requirement for PostCSS/Tailwind
$files = @(
  'postcss.config.ts',
  'tailwind.config.ts',
  'InventoryPostcss.config.ts',
  'InventoryTailwind.config.ts'
)
foreach ($f in $files) {
  if (Test-Path $f) { Remove-Item $f -Force }
}
