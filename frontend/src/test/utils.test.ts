import { describe, expect, it } from "vitest";
import { friendlyMessage } from "@/scripts/notifications";
import { setYearMonth } from "@/utils/date";
import {
  isFullName,
  maskPhoneInput,
  phoneIntl,
  phoneLabel,
  phonePretty,
  sanitizePersonName,
} from "@/utils/format";
import { pageWindow, paginate } from "@/utils/pagination";
import { socialLinksOf, socialUrl } from "@/utils/social";

describe("telefones", () => {
  it("aplica a máscara progressiva do WhatsApp", () => {
    expect(maskPhoneInput("7")).toBe("(7");
    expect(maskPhoneInput("799")).toBe("(79) 9");
    expect(maskPhoneInput("7999998888")).toBe("(79) 9999-8888");
    expect(maskPhoneInput("79999998888")).toBe("(79) 99999-8888");
    expect(maskPhoneInput("7999999888877")).toBe("(79) 99999-8888");
  });
  it("formata e converte para DDI 55", () => {
    expect(phoneLabel("79999998888")).toBe("(79) 99999-8888");
    expect(phoneLabel("")).toBe("Sem telefone");
    expect(phoneIntl("(79) 99999-8888")).toBe("5579999998888");
    expect(phonePretty("5579999998888")).toBe("(79) 99999-8888");
  });
});

describe("nome do cliente", () => {
  it("remove caracteres inválidos e exige nome e sobrenome", () => {
    expect(sanitizePersonName("João1  Silva!")).toBe("João Silva");
    expect(isFullName("João Silva")).toBe(true);
    expect(isFullName("João")).toBe(false);
    expect(isFullName("João S")).toBe(false);
  });
});

describe("datas", () => {
  it("troca mês/ano mantendo o dia dentro do limite do mês", () => {
    expect(setYearMonth("2026-01-31", null, 1)).toBe("2026-02-28");
    expect(setYearMonth("2026-03-15", 2027, null)).toBe("2027-03-15");
  });
});

describe("paginação", () => {
  it("limita a página e informa o intervalo exibido", () => {
    const page = paginate(
      Array.from({ length: 23 }, (_, i) => i),
      9,
    );
    expect(page.currentPage).toBe(3);
    expect(page.items).toEqual([20, 21, 22]);
    expect([page.start, page.end, page.totalPages]).toEqual([21, 23, 3]);
    expect(paginate([], 1)).toMatchObject({ start: 0, end: 0, totalPages: 1 });
  });
  it("mostra até cinco páginas vizinhas", () => {
    expect(pageWindow(1, 10)).toEqual({ first: 1, last: 5 });
    expect(pageWindow(6, 10)).toEqual({ first: 4, last: 8 });
    expect(pageWindow(10, 10)).toEqual({ first: 6, last: 10 });
  });
});

describe("redes sociais", () => {
  it("aceita @usuario, URL e domínio, e recusa outros esquemas", () => {
    expect(socialUrl("instagram", "@barbearia")).toBe("https://instagram.com/barbearia");
    expect(socialUrl("facebook", "facebook.com/pagina")).toBe("https://facebook.com/pagina");
    expect(socialUrl("instagram", "https://x.com/a")).toBe("https://x.com/a");
    expect(socialUrl("instagram", "javascript:alert(1)")).toBe("");
  });
  it("lista só as redes preenchidas", () => {
    const shop = { name: "", tagline: "", address: "", whatsapp: "79999998888", instagram: "@b" };
    expect(socialLinksOf(shop).map((s) => s.label)).toEqual(["WhatsApp", "Instagram"]);
  });
});

describe("mensagens", () => {
  it("esconde detalhes técnicos de erros", () => {
    expect(friendlyMessage("TypeError: x is undefined")).toBe(
      "Ocorreu um erro no sistema. Tente novamente em instantes.",
    );
    expect(friendlyMessage("Agendamento criado!")).toBe("Agendamento criado!");
  });
});
