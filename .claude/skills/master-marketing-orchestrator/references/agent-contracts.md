# Contratos entre agentes
Cada agente debe devolver:
status: ready | needs_input | blocked | complete
facts: []
assumptions: []
recommendations: []
risks: []
approval_required: true/false
next_action: ""
evidence: []
El Orchestrator no interpreta silencio como aprobación.
