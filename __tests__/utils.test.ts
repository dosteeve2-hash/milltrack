import { describe, it, expect } from "vitest";

describe("Formatage monetaire FCFA", () => {
  it("les chiffres sont preserves dans le formatage fr-FR", () => {
    const formatted = new Intl.NumberFormat("fr-FR").format(1500000);
    expect(formatted.replace(/[^0-9]/g, "")).toBe("1500000");
  });

  it("formate zero", () => {
    expect(new Intl.NumberFormat("fr-FR").format(0)).toBe("0");
  });

  it("formate 75000", () => {
    const formatted = new Intl.NumberFormat("fr-FR").format(75000);
    expect(formatted.replace(/[^0-9]/g, "")).toBe("75000");
  });
});

describe("Calcul rendement mouture", () => {
  it("rendement 70% sur 1000 kg de grains", () => {
    expect(Math.round(1000 * 0.70)).toBe(700);
  });

  it("calcul perte mouture sur 500 kg", () => {
    const grains = 500;
    const rendement = 0.70;
    expect(Math.round(grains * (1 - rendement))).toBe(150);
  });
});
