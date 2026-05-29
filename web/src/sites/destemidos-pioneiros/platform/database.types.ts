export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      atividades_top: {
        Row: {
          created_at: string
          descricao: string | null
          evento_nome: string | null
          hora_planejada: string | null
          hora_real: string | null
          id: string
          localizacao_lat: number | null
          localizacao_lng: number | null
          nome: string
          tipo: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          evento_nome?: string | null
          hora_planejada?: string | null
          hora_real?: string | null
          id?: string
          localizacao_lat?: number | null
          localizacao_lng?: number | null
          nome: string
          tipo: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          evento_nome?: string | null
          hora_planejada?: string | null
          hora_real?: string | null
          id?: string
          localizacao_lat?: number | null
          localizacao_lng?: number | null
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      exames: {
        Row: {
          arquivo_url: string
          created_at: string
          id: string
          motivo_reprovacao: string | null
          senderista_id: string
          tipo: string
          validado: boolean | null
          validado_por: string | null
        }
        Insert: {
          arquivo_url: string
          created_at?: string
          id?: string
          motivo_reprovacao?: string | null
          senderista_id: string
          tipo: string
          validado?: boolean | null
          validado_por?: string | null
        }
        Update: {
          arquivo_url?: string
          created_at?: string
          id?: string
          motivo_reprovacao?: string | null
          senderista_id?: string
          tipo?: string
          validado?: boolean | null
          validado_por?: string | null
        }
        Relationships: []
      }
      hakunas: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: string
        }
        Relationships: []
      }
      mensagens_apoio: {
        Row: {
          arquivo_url: string | null
          conteudo: string | null
          created_at: string
          enviado_por: string
          id: string
          senderista_id: string
          tipo: string
          titulo: string | null
          visualizado: boolean
          visualizado_em: string | null
        }
        Insert: {
          arquivo_url?: string | null
          conteudo?: string | null
          created_at?: string
          enviado_por: string
          id?: string
          senderista_id: string
          tipo: string
          titulo?: string | null
          visualizado?: boolean
          visualizado_em?: string | null
        }
        Update: {
          arquivo_url?: string | null
          conteudo?: string | null
          created_at?: string
          enviado_por?: string
          id?: string
          senderista_id?: string
          tipo?: string
          titulo?: string | null
          visualizado?: boolean
          visualizado_em?: string | null
        }
        Relationships: []
      }
      participacoes: {
        Row: {
          atividade_id: string
          hakuna_id: string | null
          id: string
          notas: string | null
          registrado_em: string
          senderista_id: string
          tipo: string
        }
        Insert: {
          atividade_id: string
          hakuna_id?: string | null
          id?: string
          notas?: string | null
          registrado_em?: string
          senderista_id: string
          tipo: string
        }
        Update: {
          atividade_id?: string
          hakuna_id?: string | null
          id?: string
          notas?: string | null
          registrado_em?: string
          senderista_id?: string
          tipo?: string
        }
        Relationships: []
      }
      prontuarios: {
        Row: {
          condutas: string | null
          created_at: string
          fotos_urls: string[]
          hakuna_id: string | null
          id: string
          queixas: string | null
          senderista_id: string
        }
        Insert: {
          condutas?: string | null
          created_at?: string
          fotos_urls?: string[]
          hakuna_id?: string | null
          id?: string
          queixas?: string | null
          senderista_id: string
        }
        Update: {
          condutas?: string | null
          created_at?: string
          fotos_urls?: string[]
          hakuna_id?: string | null
          id?: string
          queixas?: string | null
          senderista_id?: string
        }
        Relationships: []
      }
      senderistas: {
        Row: {
          altura_cm: number | null
          cidade: string | null
          classificacao_risco: string
          codigo_ingresso: string | null
          comorbidades: string[]
          cond_fisica_autorelatada: number | null
          cond_medica_detalhada: string | null
          cpf: string | null
          created_at: string
          data_cadastro_origem: string | null
          data_nascimento: string
          email: string | null
          email_conjuge: string | null
          estado: string | null
          evento_nome: string | null
          exames_exigidos: string[]
          familia: string | null
          id: string
          igreja: string | null
          imc: number | null
          instagram: string | null
          medicamentos: string | null
          mensagens_token: string
          motivo_reprovacao: string | null
          nfc_tag_id: string | null
          nome: string
          nome_acompanhante: string | null
          nome_conjuge: string | null
          orientacoes: string | null
          peso_kg: number | null
          plano_saude: boolean
          profissao: string | null
          qual_plano: string | null
          restricao_alimentar: boolean
          status: string
          status_ingresso: string
          status_presenca: string
          tamanho_camisa: string | null
          telefone: string
          termo_aceito: boolean
          termo_aceito_em: string | null
          ticketgo_id: number | null
          tipo_participante: string
          tipo_sanguineo: string | null
          updated_at: string
          upload_token: string
          uso_medicamento: boolean
          vai_acompanhado: boolean
          valor_bilhete: number | null
          whatsapp_conjuge: string | null
        }
        Insert: {
          altura_cm?: number | null
          cidade?: string | null
          classificacao_risco: string
          codigo_ingresso?: string | null
          comorbidades?: string[]
          cond_fisica_autorelatada?: number | null
          cond_medica_detalhada?: string | null
          cpf?: string | null
          created_at?: string
          data_cadastro_origem?: string | null
          data_nascimento: string
          email?: string | null
          email_conjuge?: string | null
          estado?: string | null
          evento_nome?: string | null
          exames_exigidos?: string[]
          familia?: string | null
          id?: string
          igreja?: string | null
          imc?: number | null
          instagram?: string | null
          medicamentos?: string | null
          mensagens_token?: string
          motivo_reprovacao?: string | null
          nfc_tag_id?: string | null
          nome: string
          nome_acompanhante?: string | null
          nome_conjuge?: string | null
          orientacoes?: string | null
          peso_kg?: number | null
          plano_saude?: boolean
          profissao?: string | null
          qual_plano?: string | null
          restricao_alimentar?: boolean
          status?: string
          status_ingresso?: string
          status_presenca?: string
          tamanho_camisa?: string | null
          telefone: string
          termo_aceito?: boolean
          termo_aceito_em?: string | null
          ticketgo_id?: number | null
          tipo_participante?: string
          tipo_sanguineo?: string | null
          updated_at?: string
          upload_token?: string
          uso_medicamento?: boolean
          vai_acompanhado?: boolean
          valor_bilhete?: number | null
          whatsapp_conjuge?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["senderistas"]["Insert"]>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      get_senderista_publico: {
        Args: { p_token: string }
        Returns: {
          id: string
          nome: string
          status: string
          classificacao_risco: string
          exames_exigidos: string[]
          orientacoes: string | null
          motivo_reprovacao: string | null
          evento_nome: string | null
        }[]
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]

export type Senderista = Tables<"senderistas">
export type Hakuna = Tables<"hakunas">
export type Exame = Tables<"exames">
export type Prontuario = Tables<"prontuarios">
export type MensagemApoio = Tables<"mensagens_apoio">
export type AtividadeTop = Tables<"atividades_top">
export type Participacao = Tables<"participacoes">
