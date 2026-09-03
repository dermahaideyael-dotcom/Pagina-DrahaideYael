@echo off
cd /d "C:\Users\jonat\OneDrive\Documentos\Pagina clinica"
"C:\Users\jonat\OneDrive\Documentos\MiroFish\backend\.venv\Scripts\python.exe" scripts\mirofish_orchestrator.py "docs\mirofish-seeds\campana-acne-v3-intermedio.md" --campaign "acne-v3-intermedio" --personas "docs\mirofish-personas\acne_agents_001_to_025_liviano.md" --platform parallel --max-rounds 8 > "docs\mirofish-reports\acne-v3-scheduled-run.log" 2>&1
