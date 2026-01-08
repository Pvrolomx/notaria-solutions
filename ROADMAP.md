# NOTARIA-SOLUTIONS ROADMAP
## La App que Mata Notarias

### FASE 1 - MVP (Actual)
- [x] Calculadora ISR para enajenación de inmuebles
- [x] Interfaz web responsive
- [x] Deploy en Vercel

### FASE 2 - KYC AutoFill 🆕
- [ ] Auto-llenado de formularios KYC/Escrow
- [ ] OCR de documentos (INE, comprobantes)
- [ ] Extracción automática: nombre, CURP, RFC, dirección
- [ ] Mapeo inteligente a campos de formulario
- [ ] Exportar PDF llenado

### FASE 3 - Expansión
- [ ] Calculadora de gastos notariales completos
- [ ] Generador de contratos (compraventa, arrendamiento)
- [ ] Integración con SAT para validación de RFC
- [ ] Base de datos de clientes recurrentes

### FASE 4 - White Label
- [ ] Versión personalizable para cada notaría
- [ ] Branding customizable
- [ ] Subdominios por cliente

---
Generado por LAQCA 🐝 | Colmena 2026

## ESTÁNDARES DE DESARROLLO

### Almacenamiento de Archivos
**REGLA OBLIGATORIA**: Toda app que almacene expedientes o documentos DEBE usar IndexedDB para archivos adjuntos.

**Razones:**
- localStorage tiene límite 5-10MB (insuficiente)
- IndexedDB maneja archivos grandes (50MB+)
- Funciona 100% offline
- Datos permanecen en dispositivo del usuario (privacidad)

**Aplicable a:**
- Hub Notarial (expedientes) ✓ Implementado
- Cualquier módulo con archivos adjuntos
- Apps futuras con documentos

**Patrón de implementación:**
- Metadata (nombre, fecha, estado) → localStorage
- Archivos binarios (PDF, imágenes) → IndexedDB
- Escalabilidad → SD externa en Android

