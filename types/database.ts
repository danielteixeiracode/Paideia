// Tipos manuais espelhando supabase/schema.sql
// (equivalente ao output de `supabase gen types typescript`)

export type PapelUsuario = "aluno" | "administrador";
export type TipoAtivo = "livro" | "curso" | "exercicio" | "tratado" | "audio" | "interativo";
export type NivelAtivo = "iniciante" | "intermediario" | "avancado";
export type StatusCarteira = "planejado" | "em_andamento" | "concluido" | "pausado";
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

export interface Ativo {
  id: string;
  titulo: string;
  subtitulo: string | null;
  autor: string | null;
  tipo: TipoAtivo;
  eixo_id: string | null;
  capacidade_id: string | null;
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

// ---------------------------------------------------------------------
// Novo modelo do corpo: Obra → Função pedagógica → Exercício → Fruto → Registro
// ---------------------------------------------------------------------

export interface Epoca {
  id: string;
  numero: number;
  nome: string;
  descricao: string | null;
}

export interface FuncaoPedagogica {
  id: string;
  numero: number;
  nome: string;
  o_que_forma: string | null;
  descricao: string | null;
}

export interface Obra {
  id: string;
  titulo: string;
  autor: string | null;
  epoca_id: string | null;
  descricao: string | null;
  imagem_url: string | null;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  epoca?: Epoca;
}

export interface ObraFuncao {
  obra_id: string;
  funcao_id: string;
  nota: string | null;
  obra?: Obra;
  funcao?: FuncaoPedagogica;
}

export interface Exercicio {
  id: string;
  funcao_id: string;
  obra_id: string | null;
  titulo: string;
  enunciado: string | null;
  metodo: string | null;
  ordem: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  funcao?: FuncaoPedagogica;
  obra?: Obra;
}

export interface CarteiraObra {
  id: string;
  user_id: string;
  obra_id: string;
  estado: string;
  criado_em: string;
  atualizado_em: string;
  obra?: Obra;
}

export interface Fruto {
  id: string;
  user_id: string;
  exercicio_id: string | null;
  obra_id: string | null;
  funcao_id: string | null;
  conversa_id: string | null;
  tipo: string;
  conteudo: string;
  criado_em: string;
  atualizado_em: string;
}

export interface RegistroEvento {
  id: string;
  user_id: string;
  tipo: string;
  obra_id: string | null;
  funcao_id: string | null;
  exercicio_id: string | null;
  fruto_id: string | null;
  conversa_id: string | null;
  metadata: Record<string, unknown>;
  criado_em: string;
}

export interface Database {
  public: {
    Tables: {
      perfis: { Row: Perfil; Insert: Partial<Perfil>; Update: Partial<Perfil> };
      eixos: { Row: Eixo; Insert: Partial<Eixo>; Update: Partial<Eixo> };
      capacidades: { Row: Capacidade; Insert: Partial<Capacidade>; Update: Partial<Capacidade> };
      ativos: { Row: Ativo; Insert: Partial<Ativo>; Update: Partial<Ativo> };
      config_socrates: { Row: ConfigSocrates; Insert: Partial<ConfigSocrates>; Update: Partial<ConfigSocrates> };
      carteira_itens: { Row: CarteiraItem; Insert: Partial<CarteiraItem>; Update: Partial<CarteiraItem> };
      planejamento_semanal: { Row: PlanejamentoSemanal; Insert: Partial<PlanejamentoSemanal>; Update: Partial<PlanejamentoSemanal> };
      atividades_planejadas: { Row: AtividadePlanejada; Insert: Partial<AtividadePlanejada>; Update: Partial<AtividadePlanejada> };
      registros_estudo: { Row: RegistroEstudo; Insert: Partial<RegistroEstudo>; Update: Partial<RegistroEstudo> };
      constancia_diaria: { Row: ConstanciaDiaria; Insert: Partial<ConstanciaDiaria>; Update: Partial<ConstanciaDiaria> };
      conversas_socrates: { Row: ConversaSocrates; Insert: Partial<ConversaSocrates>; Update: Partial<ConversaSocrates> };
      mensagens_socrates: { Row: MensagemSocrates; Insert: Partial<MensagemSocrates>; Update: Partial<MensagemSocrates> };
      notificacoes: { Row: Notificacao; Insert: Partial<Notificacao>; Update: Partial<Notificacao> };
      epocas: { Row: Epoca; Insert: Partial<Epoca>; Update: Partial<Epoca> };
      funcoes_pedagogicas: { Row: FuncaoPedagogica; Insert: Partial<FuncaoPedagogica>; Update: Partial<FuncaoPedagogica> };
      obras: { Row: Obra; Insert: Partial<Obra>; Update: Partial<Obra> };
      obra_funcoes: { Row: ObraFuncao; Insert: Partial<ObraFuncao>; Update: Partial<ObraFuncao> };
      exercicios: { Row: Exercicio; Insert: Partial<Exercicio>; Update: Partial<Exercicio> };
      carteira_obras: { Row: CarteiraObra; Insert: Partial<CarteiraObra>; Update: Partial<CarteiraObra> };
      frutos: { Row: Fruto; Insert: Partial<Fruto>; Update: Partial<Fruto> };
      // Só inserção: o RLS não permite update nem delete.
      registro_eventos: { Row: RegistroEvento; Insert: Partial<RegistroEvento>; Update: Partial<RegistroEvento> };
    };
  };
}
