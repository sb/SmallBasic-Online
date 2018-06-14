import "jasmine";
import { CompilerUtils } from "../../../src/compiler/utils/compiler-utils";
import { RuntimeLibraries } from "../../../src/compiler/runtime/libraries";

describe("Compiler.Runtime.LibrariesMetadata", () => {
    it("all libraries have correct metadata", () => {
        const libraries = new RuntimeLibraries();

        CompilerUtils.values(RuntimeLibraries.Metadata).forEach(library => {
            expect(library.typeName.length).toBeGreaterThan(0);
            expect(library.description.length).toBeGreaterThan(0);
            expect(library.kind).toBeDefined();

            CompilerUtils.values(library.methods).forEach(method => {
                expect(method.typeName.length).toBeGreaterThan(0);
                expect(method.methodName.length).toBeGreaterThan(0);
                expect(method.description.length).toBeGreaterThan(0);
                expect(method.returnsValue).toBeDefined();

                method.parameters.forEach(parameter => {
                    expect(parameter.length).toBeGreaterThan(0);
                    expect(method.parameterDescription(parameter).length).toBeGreaterThan(0);
                });
            });

            CompilerUtils.values(library.properties).forEach(property => {
                expect(property.typeName.length).toBeGreaterThan(0);
                expect(property.propertyName.length).toBeGreaterThan(0);
                expect(property.description.length).toBeGreaterThan(0);

                expect(property.hasGetter).toBe(!!libraries[property.typeName].properties[property.propertyName].getter);
                expect(property.hasSetter).toBe(!!libraries[property.typeName].properties[property.propertyName].setter);
            });
        });
    });
});
