import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutos(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h <= 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}min`;
}

export function formatHoras(horas: number) {
  return formatMinutos(Math.round(horas * 60));
}

export function pct(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const DIAS_SEMANA_CURTO = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function nomeDiaSemana(date: Date) {
  return DIAS_SEMANA[date.getDay()];
}

export function nomeDiaSemanaCurto(date: Date) {
  return DIAS_SEMANA_CURTO[date.getDay()];
}

export function formatDataLonga(date: Date) {
  return `${date.getDate()} de ${MESES[date.getMonth()]}`;
}

export function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // semana começa na segunda
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

const ROMANOS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function romano(n: number) {
  return ROMANOS[n] ?? String(n);
}
