-- =========================================================================
-- PAIDEIA — remove os eventos de EXEMPLO criados por exemplo-eventos.sql.
-- Apaga só os eventos marcados com metadata = {"exemplo": "eventos"}, de
-- qualquer conta. Nenhum outro evento é tocado.
-- =========================================================================

delete from registro_eventos where metadata->>'exemplo' = 'eventos';
