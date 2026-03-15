import { describe, it, expect } from "vitest";
import routes from "../src/Config/routes";

describe("App", () => {
    it("routes config is defined", () => {
        expect(routes).toBeDefined();
        expect(routes.Home).toBeDefined();
        expect(routes.Home.path).toBe("/");
        expect(routes.Projects).toBeDefined();
        expect(routes.Bunq).toBeDefined();
    });
});
