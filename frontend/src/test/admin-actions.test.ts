import { describe, expect, it } from "vitest";
import { clientKey, isFinancialRecord, serviceIdsOf } from "@/scripts/scheduling";

describe("regras das exclusões da gestão", () => {
  it("pagos ou concluídos são histórico financeiro (não podem ser excluídos)", () => {
    expect(isFinancialRecord({ paid: true, status: "confirmado" })).toBe(true);
    expect(isFinancialRecord({ paid: false, status: "concluido" })).toBe(true);
    expect(isFinancialRecord({ paid: false, status: "cancelado" })).toBe(false);
    expect(isFinancialRecord({ paid: false, status: "pendente" })).toBe(false);
  });

  it("serviços do agendamento como lista, inclusive registros antigos", () => {
    expect(serviceIdsOf({ serviceId: "s1" })).toEqual(["s1"]);
    expect(serviceIdsOf({ serviceId: "s1", serviceIds: [] })).toEqual(["s1"]);
    expect(serviceIdsOf({ serviceId: "s1", serviceIds: ["s1", "s3"] })).toEqual(["s1", "s3"]);
  });

  it("agrupa o cliente pelo nome sem diferenciar maiúsculas e espaços nas pontas", () => {
    expect(clientKey("  Maria Lima ")).toBe(clientKey("maria lima"));
  });
});
