// Leitura humana dos eventos de registro_eventos ("Guardou X na Carteira").
// O tipo é texto livre no banco; os conhecidos têm frase própria e os demais
// aparecem pelo próprio nome. Vocabulário provisório, cresce com o app.

export interface EventoLegivel {
  tipo: string;
  obra?: { titulo: string } | null;
  funcao?: { nome: string } | null;
  exercicio?: { titulo: string } | null;
}

export function descreverEvento({ tipo, obra, funcao, exercicio }: EventoLegivel) {
  const nomeObra = obra?.titulo;
  switch (tipo) {
    case "obra_guardada":
      return `Guardou ${nomeObra ?? "uma obra"} na Carteira`;
    case "obra_removida":
      return `Tirou ${nomeObra ?? "uma obra"} da Carteira`;
    case "exercicio_feito":
      return exercicio ? `Fez o exercício ${exercicio.titulo}` : `Fez um exercício${funcao ? ` de ${funcao.nome.toLowerCase()}` : ""}`;
    case "fruto_colhido":
      return nomeObra ? `Colheu um fruto de ${nomeObra}` : "Colheu um fruto";
    case "dialogo_socratico":
      return nomeObra ? `Conversou com o Sócrates sobre ${nomeObra}` : "Conversou com o Sócrates";
    case "leitura":
      return nomeObra ? `Leu ${nomeObra}` : "Fez uma leitura";
    default: {
      const nome = tipo.replace(/_/g, " ");
      const frase = nome.charAt(0).toUpperCase() + nome.slice(1);
      return nomeObra ? `${frase}: ${nomeObra}` : frase;
    }
  }
}
