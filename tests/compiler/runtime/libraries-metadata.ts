import "jasmine";
import { CompilerUtils } from "../../../src/compiler/utils/compiler-utils";
import { RuntimeLibraries } from "../../../src/compiler/runtime/libraries";

describe("Compiler.Runtime.LibrariesMetadata", () => {
    it("all libraries have correct metadata", () => {
        const implementations = new RuntimeLibraries();

        CompilerUtils.values(RuntimeLibraries.Metadata).forEach(library => {
            const libraryImplementation = implementations[library.typeName];
            expect(libraryImplementation).toBeDefined();

            expect(library.typeName.length).toBeGreaterThan(0);
            expect(library.description.length).toBeGreaterThan(0);
            expect(library.programKind).toBeDefined();

            CompilerUtils.values(library.methods).forEach(method => {
                expect(method.typeName.length).toBeGreaterThan(0);
                expect(method.methodName.length).toBeGreaterThan(0);
                expect(method.description.length).toBeGreaterThan(0);
                expect(method.returnsValue).toBeDefined();

                method.parameters.forEach(parameter => {
                    expect(parameter.length).toBeGreaterThan(0);
                    expect(method.parameterDescription(parameter).length).toBeGreaterThan(0);
                });

                expect(libraryImplementation.methods[method.methodName]).toBeDefined();
                delete (<any>libraryImplementation.methods)[method.methodName];
            });

            expect(Object.keys(libraryImplementation.methods).length).toBe(0);

            CompilerUtils.values(library.properties).forEach(property => {
                expect(property.typeName.length).toBeGreaterThan(0);
                expect(property.propertyName.length).toBeGreaterThan(0);
                expect(property.description.length).toBeGreaterThan(0);

                const propertyImplementation = libraryImplementation.properties[property.propertyName];
                expect(property.hasGetter).toBe(!!propertyImplementation.getter);
                expect(property.hasSetter).toBe(!!propertyImplementation.setter);

                delete (<any>libraryImplementation.properties)[property.propertyName];
            });

            expect(Object.keys(libraryImplementation.properties).length).toBe(0);

            CompilerUtils.values(library.events).forEach(event => {
                expect(event.typeName.length).toBeGreaterThan(0);
                expect(event.eventName.length).toBeGreaterThan(0);
                expect(event.description.length).toBeGreaterThan(0);

                const eventImplementation = libraryImplementation.events[event.eventName];
                expect(eventImplementation.setSubModule).toBeDefined();
                expect(eventImplementation.raise).toBeDefined();

                delete (<any>libraryImplementation.events)[event.eventName];
            });

            expect(Object.keys(libraryImplementation.events).length).toBe(0);

            delete (<any>implementations)[library.typeName];
        });

        expect(Object.keys(implementations).length).toBe(0);
    });
});
