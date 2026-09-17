// Tipos manuais espelhando supabase/schema.sql
// (equivalente ao output de `supabase gen types typescript`)

export type PapelUsuario = "aluno" | "administrador";
export type TipoAtivo = "livro" | "curso" | "exercicio" | "tratado" | "audio" | "interativo";
export type NivelAtivo = "iniciante" | "intermediario" | "avancado";
export type StatusCarteira = "planejado" | "em_andamento" | "concluido" | "pausado";
export type StatusEtapa = "bloqueada" | "disponivel" | "em_andamento" | "concluida";
export type PeriodoDia = "matutino" | "vespertino" | "noturno";
export type StatusAtividade = "pendente" | "em_andamento" | "concluida" | "atrasada";
export type ModoSocrates = "maieutico" | "exegese" | "exame";
export type RemetenteMsg = "usuario" | "socrates";
export type TipoNotificacao = "lembrete" | "atraso" | "conquista" | "sistema" | "socrates";

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  avatar_url: string | null;
  grau_atual: string;
  meta_diaria_min: number;
  meta_semanal_horas: number;
  onboarding_concluido: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Eixo {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  cor: string;
  icone: string | null;
  ordem: number;
  ativo: boolean;
}

export interface Capacidade {
  id: string;
  eixo_id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
}

export interface Trilha {
  id: string;
  nome: string;
  descricao: string | null;
  subtitulo: string | null;
  ordem: number;
  ativo: boolean;
}

export interface EtapaTrilha {
  id: string;
  trilha_id: string;
  eixo_id: string;
  capacidade_id: string | null;
  etapa_anterior_id: string | null;
  codigo: string;
  titulo: string;
  descricao: string | null;
  carga_horas_estimada: number;
  selo_titulo: string | null;
  ordem: number;
  ativo: boolean;
}

export interface CapacidadeEtapa {
  id: string;
  etapa_id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
}

export interface Ativo {
  id: string;
  titulo: string;
  subtitulo: string | null;
  autor: string | null;
  tipo: TipoAtivo;
  eixo_id: string | null;
  capacidade_id: string | null;
  etapa_id: string | null;
  descricao: string | null;
  imagem_url: string | null;
  duracao_estimada_horas: number;
  nivel: NivelAtivo;
  idioma: string;
  citacao_destaque: string | null;
  metadata: Record<string, unknown>;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  eixo?: Eixo;
}

export interface ConfigSocrates {
  id: string;
  nome: string;
  system_prompt: string;
  modelo: string;
  temperatura: number;
  max_tokens: number;
  modos: ModoSocrates[];
  ativo: boolean;
  atualizado_por: string | null;
  atualizado_em: string;
}

export interface CarteiraItem {
  id: string;
  user_id: string;
  ativo_id: string;
  status: StatusCarteira;
  progresso_percentual: number;
  horas_investidas: number;
  data_inicio: string | null;
  data_conclusao: string | null;
  nota: number | null;
  anotacoes: string | null;
  criado_em: string;
  atualizado_em: string;
  ativo_ref?: Ativo;
}

export interface ProgressoTrilha {
  id: string;
  user_id: string;
  etapa_id: string;
  status: StatusEtapa;
  percentual: number;
  horas_investidas: number;
  foco_atual: boolean;
  data_inicio: string | null;
  data_conclusao: string | null;
  atualizado_em: string;
  etapa?: EtapaTrilha;
}

export interface ProgressoCapacidade {
  id: string;
  user_id: string;
  capacidade_etapa_id: string;
  dominada: boolean;
  data_dominio: string | null;
}

export interface PlanejamentoSemanal {
  id: string;
  user_id: string;
  semana_inicio: string;
  meta_horas_semanal: number;
  modo_disciplinar_ativo: boolean;
  criado_em: string;
}

export interface AtividadePlanejada {
  id: string;
  user_id: string;
  planejamento_id: string | null;
  ativo_id: string | null;
  carteira_item_id: string | null;
  etapa_id: string | null;
  eixo_id: string | null;
  titulo: string;
  descricao: string | null;
  data: string;
  periodo: PeriodoDia;
  hora_inicio: string | null;
  duracao_min: number;
  prioritaria: boolean;
  status: StatusAtividade;
  concluida_em: string | null;
  criado_em: string;
  eixo?: Eixo;
}

export interface RegistroEstudo {
  id: string;
  user_id: string;
  atividade_id: string | null;
  ativo_id: string | null;
  etapa_id: string | null;
  eixo_id: string | null;
  data: string;
  duracao_min: number;
  anotacoes: string | null;
  criado_em: string;
}

export interface ConstanciaDiaria {
  id: string;
  user_id: string;
  data: string;
  estudou: boolean;
  minutos_total: number;
  eixo_predominante_id: string | null;
}

export interface ConversaSocrates {
  id: string;
  user_id: string;
  titulo: string;
  modo: ModoSocrates;
  tema_contexto: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface MensagemSocrates {
  id: string;
  conversa_id: string;
  user_id: string;
  remetente: RemetenteMsg;
  conteudo: string;
  metadata: Record<string, unknown>;
  criado_em: string;
}

export interface Notificacao {
  id: string;
  user_id: string;
  tipo: TipoNotificacao;
  titulo: string;
  corpo: string | null;
  link: string | null;
  lida: boolean;
  criado_em: string;
}

export interface ProgressoTrilhoEtapa {
  id: string;
  user_id: string;
  trilho_id: string;
  etapa_id: string;
  status: "nao_iniciado" | "em_andamento" | "concluido";
  atualizado_em: string;
}

export interface Database {
  public: {
    Tables: {
      perfis: { Row: Perfil; Insert: Partial<Perfil>; Update: Partial<Perfil> };
      eixos: { Row: Eixo; Insert: Partial<Eixo>; Update: Partial<Eixo> };
      capacidades: { Row: Capacidade; Insert: Partial<Capacidade>; Update: Partial<Capacidade> };
      trilhas: { Row: Trilha; Insert: Partial<Trilha>; Update: Partial<Trilha> };
      etapas_trilha: { Row: EtapaTrilha; Insert: Partial<EtapaTrilha>; Update: Partial<EtapaTrilha> };
      capacidades_etapa: { Row: CapacidadeEtapa; Insert: Partial<CapacidadeEtapa>; Update: Partial<CapacidadeEtapa> };
      ativos: { Row: Ativo; Insert: Partial<Ativo>; Update: Partial<Ativo> };
      config_socrates: { Row: ConfigSocrates; Insert: Partial<ConfigSocrates>; Update: Partial<ConfigSocrates> };
      carteira_itens: { Row: CarteiraItem; Insert: Partial<CarteiraItem>; Update: Partial<CarteiraItem> };
      progresso_trilha: { Row: ProgressoTrilha; Insert: Partial<ProgressoTrilha>; Update: Partial<ProgressoTrilha> };
      progresso_capacidade: { Row: ProgressoCapacidade; Insert: Partial<ProgressoCapacidade>; Update: Partial<ProgressoCapacidade> };
      progresso_trilho_etapa: { Row: ProgressoTrilhoEtapa; Insert: Partial<ProgressoTrilhoEtapa>; Update: Partial<ProgressoTrilhoEtapa> };
      planejamento_semanal: { Row: PlanejamentoSemanal; Insert: Partial<PlanejamentoSemanal>; Update: Partial<PlanejamentoSemanal> };
      atividades_planejadas: { Row: AtividadePlanejada; Insert: Partial<AtividadePlanejada>; Update: Partial<AtividadePlanejada> };
      registros_estudo: { Row: RegistroEstudo; Insert: Partial<RegistroEstudo>; Update: Partial<RegistroEstudo> };
      constancia_diaria: { Row: ConstanciaDiaria; Insert: Partial<ConstanciaDiaria>; Update: Partial<ConstanciaDiaria> };
      conversas_socrates: { Row: ConversaSocrates; Insert: Partial<ConversaSocrates>; Update: Partial<ConversaSocrates> };
      mensagens_socrates: { Row: MensagemSocrates; Insert: Partial<MensagemSocrates>; Update: Partial<MensagemSocrates> };
      notificacoes: { Row: Notificacao; Insert: Partial<Notificacao>; Update: Partial<Notificacao> };
    };
  };
}
