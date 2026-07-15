---
"phonefield": patch
---

Add bounded, native-style undo and redo history for formatted phone edits,
including grouped typing and deletion transactions, restored selections,
country changes, and controlled or uncontrolled fields. Prevent direct `+`
entry while preserving international paste and normal Backspace removal.

Normalize pasted international numbers, select detected allowed countries, reject disallowed countries without reinterpreting their digits, and require valid numbers to match the selected country.
